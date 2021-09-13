module Main exposing (..)

-- import Html exposing (..)
-- import Html.Attributes as Attrs
-- import Html.Events exposing (onInput)

import Browser
import Bytes exposing (Bytes)
import Bytes.Encode
import Element as El exposing (Element)
import Element.Font as Font
import Element.Input as Input
import File.Download as Download
import Html.Attributes
import Image
import QRCode exposing (defaultImageOptions)
import Url


main =
    Browser.document { init = \() -> init, update = update, view = view, subscriptions = \_ -> Sub.none }


type alias EmailAddress =
    String


type alias EmailSubject =
    String


type alias EmailMessage =
    String


type alias WifiSSID =
    String


type WifiPassword
    = WPA String
    | WEP String
    | None


type alias WifiHidden =
    Bool


clearWifiPassword : WifiPassword -> WifiPassword
clearWifiPassword password =
    case password of
        WPA _ ->
            WPA ""

        WEP _ ->
            WEP ""

        None ->
            None


type QRType
    = QRText String
    | QRUrl String
    | QREmail EmailAddress EmailSubject EmailMessage
    | QRWifi WifiSSID WifiPassword WifiHidden



-- type QRTypeBase
--     = QRBaseText
--     | QRBaseUrl
--     | QRBaseEmail
--     | QRBaseWifi


qrTypes : List QRType
qrTypes =
    [ QRText ""
    , QRUrl ""
    , QREmail "" "" ""
    , QRWifi "" (WPA "") False
    ]


getQRTypeLabel : QRType -> String
getQRTypeLabel qrType =
    case qrType of
        QRText _ ->
            "Text"

        QRUrl _ ->
            "URL"

        QREmail _ _ _ ->
            "Email"

        QRWifi _ _ _ ->
            "Wifi"


clearQRType : QRType -> QRType
clearQRType qrType =
    case qrType of
        QRText _ ->
            QRText ""

        QRUrl _ ->
            QRUrl ""

        QREmail _ _ _ ->
            QREmail "" "" ""

        QRWifi _ _ _ ->
            QRWifi "" (WPA "") False


type alias Model =
    { qrType : QRType
    , errorCorrection : QRCode.ErrorCorrection
    }


type Msg
    = ChangeQRType QRType
    | ChangeErrorCorrection QRCode.ErrorCorrection
    | DownloadQRCodeAsPNG
    | NoOp



-- init : Model


init : ( Model, Cmd Msg )
init =
    ( { qrType = QRText ""
      , errorCorrection = QRCode.Quartile
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeQRType newType ->
            ( { model | qrType = newType }, Cmd.none )

        ChangeErrorCorrection ecc ->
            ( { model | errorCorrection = ecc }, Cmd.none )

        DownloadQRCodeAsPNG ->
            ( model, Download.bytes "qrcode.png" "image/png" (generateQRCodePngUrl model) )

        NoOp ->
            ( model, Cmd.none )


view : Model -> Browser.Document Msg
view model =
    { title = ""
    , body =
        [ El.layout [ El.paddingXY 48 24 ] <|
            El.row [ El.spacing 32 ]
                [ formView model
                , qrCodeImage model
                ]
        ]
    }


formView : Model -> Element Msg
formView model =
    El.row [ El.spacing 32, El.alignTop ]
        [ qrErrorCorrectionSelect model
        , El.column
            []
            [ qrTypeSelect model
            , El.el [ El.width (El.px 400) ] (qrTypeOptions model)
            ]
        ]


qrErrorCorrectionSelect : Model -> Element Msg
qrErrorCorrectionSelect model =
    El.el [ El.paddingXY 0 12, El.alignTop ] <|
        Input.radio
            [ El.padding 8 ]
            { onChange = ChangeErrorCorrection
            , selected = Just model.errorCorrection
            , label = Input.labelAbove [] (El.text "Error correction")
            , options =
                [ Input.option QRCode.Low (El.text "Low (7% redundancy)")
                , Input.option QRCode.Medium (El.text "Medium (15% redundancy)")
                , Input.option QRCode.Quartile (El.text "Quartile (25% redundancy)")
                , Input.option QRCode.High (El.text "High (30% redundancy)")
                ]
            }


qrTypeSelect : Model -> Element Msg
qrTypeSelect model =
    El.el [ El.paddingXY 0 12, El.alignTop ] <|
        Input.radioRow
            [ El.spacing 12, El.paddingXY 0 8 ]
            { onChange = ChangeQRType
            , selected = Just <| clearQRType model.qrType
            , label = Input.labelAbove [] (El.text "QR type")
            , options = qrTypes |> List.map (\qrType -> Input.option (clearQRType qrType) (El.text (getQRTypeLabel qrType)))
            }


qrTypeOptions : Model -> Element Msg
qrTypeOptions model =
    case model.qrType of
        QRText value ->
            Input.multiline [ El.width El.fill ]
                { onChange = ChangeQRType << QRText
                , text = value
                , placeholder = Nothing
                , label = Input.labelAbove [] (El.text "Text")
                , spellcheck = True
                }

        QRUrl url ->
            Input.text [ El.width El.fill ]
                { onChange = ChangeQRType << QRUrl
                , text = url
                , placeholder = Just <| Input.placeholder [] (El.text "https://example.com")
                , label = Input.labelAbove [] (El.text "URL")
                }

        QREmail address subject body ->
            El.column [ El.spacingXY 0 12, El.width El.fill ]
                [ Input.text []
                    { onChange = ChangeQRType << (\val -> QREmail val subject body)
                    , text = address
                    , placeholder = Just <| Input.placeholder [] (El.text "name@example.com")
                    , label = Input.labelAbove [] (El.text "Email address")
                    }
                , Input.text []
                    { onChange = ChangeQRType << (\val -> QREmail address val body)
                    , text = subject
                    , placeholder = Nothing
                    , label = Input.labelAbove [] (El.text "Subject")
                    }
                , Input.multiline []
                    { onChange = ChangeQRType << (\val -> QREmail address subject val)
                    , text = body
                    , placeholder = Nothing
                    , label = Input.labelAbove [] (El.text "Body")
                    , spellcheck = True
                    }
                ]

        QRWifi ssid password hidden ->
            El.column [ El.spacingXY 0 12, El.width El.fill ]
                [ Input.text []
                    { onChange = ChangeQRType << (\val -> QRWifi val password hidden)
                    , text = ssid
                    , placeholder = Just <| Input.placeholder [] (El.text "Wifi name")
                    , label = Input.labelAbove [] (El.text "SSID")
                    }
                , Input.radioRow [ El.paddingXY 0 8, El.spacing 12 ]
                    { onChange = ChangeQRType << (\pass -> QRWifi ssid pass hidden)
                    , selected = Just <| clearWifiPassword password
                    , label = Input.labelAbove [] (El.text "Password type")
                    , options =
                        [ Input.option (WPA "") (El.text "WPA/WPA2")
                        , Input.option (WEP "") (El.text "WEP")
                        , Input.option None (El.text "None")
                        ]
                    }
                , case password of
                    WPA wpa ->
                        Input.newPassword []
                            { onChange = ChangeQRType << (\val -> QRWifi ssid (WPA val) hidden)
                            , text = wpa
                            , placeholder = Just <| Input.placeholder [] (El.text "password")
                            , label = Input.labelAbove [] (El.text "Password")
                            , show = True
                            }

                    WEP wep ->
                        Input.newPassword []
                            { onChange = ChangeQRType << (\val -> QRWifi ssid (WPA val) hidden)
                            , text = wep
                            , placeholder = Just <| Input.placeholder [] (El.text "password")
                            , label = Input.labelAbove [] (El.text "Password")
                            , show = True
                            }

                    None ->
                        El.none
                , Input.checkbox [ El.paddingXY 0 12 ]
                    { onChange = ChangeQRType << (\val -> QRWifi ssid password val)
                    , icon = Input.defaultCheckbox
                    , checked = hidden
                    , label = Input.labelRight [] (El.text "Hidden")
                    }
                ]


encodeQRType : QRType -> String
encodeQRType qrType =
    case qrType of
        QRText value ->
            value

        QRUrl url ->
            url

        QREmail address subject message ->
            "mailto:" ++ Url.percentEncode address ++ "?subject=" ++ Url.percentEncode subject ++ "&body=" ++ Url.percentEncode message

        QRWifi ssid password hidden ->
            let
                escapeStr =
                    String.replace ";" "\\;"

                formattedPassword =
                    case password of
                        WPA pass ->
                            "P:" ++ escapeStr pass ++ ";"

                        WEP pass ->
                            "P:" ++ escapeStr pass ++ ";"

                        None ->
                            ""

                formattedPasswordType =
                    case password of
                        WPA _ ->
                            "T:WPA;"

                        WEP _ ->
                            "T:WEP;"

                        None ->
                            ""

                formattedSSID =
                    "S:" ++ escapeStr ssid ++ ";"

                formattedHidden =
                    if hidden then
                        "H:true;"

                    else
                        ""
            in
            "WIFI:" ++ formattedPasswordType ++ formattedSSID ++ formattedPassword ++ formattedHidden ++ ";"


generateQRCodePngUrl : Model -> Bytes
generateQRCodePngUrl model =
    case QRCode.fromStringWith model.errorCorrection (encodeQRType model.qrType) of
        Err _ ->
            Bytes.Encode.encode <| Bytes.Encode.string "ERROR"

        Ok code ->
            Image.toPng (QRCode.toImageWithOptions { defaultImageOptions | moduleSize = 10 } code)


qrCodeImage : Model -> Element Msg
qrCodeImage model =
    case QRCode.fromStringWith model.errorCorrection (encodeQRType model.qrType) of
        Err _ ->
            El.text "Something went wrong"

        Ok code ->
            El.column [ El.alignTop, El.spacing 16 ]
                [ El.el [] <|
                    El.html <|
                        QRCode.toSvgWithoutQuietZone
                            [ Html.Attributes.width 200
                            , Html.Attributes.height 200
                            ]
                            code
                , Input.button
                    [ Font.color (El.rgb 0.2 0.2 0.8) ]
                    { onPress = Just DownloadQRCodeAsPNG
                    , label = El.text "Download PNG"
                    }
                ]

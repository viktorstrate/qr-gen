module Main exposing (..)

-- import Html exposing (..)
-- import Html.Attributes as Attrs
-- import Html.Events exposing (onInput)

import Browser
import Bytes exposing (Bytes)
import Bytes.Encode
import File.Download as Download
import Html exposing (Html, div, text)
import Html.Attributes as Attrs
import Html.Events exposing (onCheck, onClick, onInput)
import Image
import QRCode exposing (ErrorCorrection, defaultImageOptions)
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
    { title = "QR Code Generator"
    , body =
        [ div []
            [ formView model
            , qrCodeImage model
            ]
        ]
    }


formView : Model -> Html Msg
formView model =
    div []
        [ qrTypeSelect model
        , qrTypeOptions model
        , qrErrorCorrectionSelect model
        ]



-- El.row [ El.spacing 32, El.alignTop ]
--     [ qrErrorCorrectionSelect model
--     , El.column
--         []
--         [ qrTypeSelect model
--         , El.el [ El.width (El.px 400) ] (qrTypeOptions model)
--         ]
--     ]


errorCorrectionValueToType : String -> ErrorCorrection
errorCorrectionValueToType val =
    case val of
        "low" ->
            QRCode.Low

        "medium" ->
            QRCode.Medium

        "quartile" ->
            QRCode.Quartile

        "high" ->
            QRCode.High

        _ ->
            QRCode.Quartile


qrErrorCorrectionSelect : Model -> Html Msg
qrErrorCorrectionSelect model =
    div []
        [ Html.label []
            [ text "Error correction"
            , Html.select
                [ onInput (ChangeErrorCorrection << errorCorrectionValueToType)
                ]
                [ Html.option [ Attrs.value "low", Attrs.selected (model.errorCorrection == QRCode.Low) ] [ text "Low (7% redundancy)" ]
                , Html.option [ Attrs.value "medium", Attrs.selected (model.errorCorrection == QRCode.Medium) ] [ text "Medium (15% redundancy)" ]
                , Html.option [ Attrs.value "quartile", Attrs.selected (model.errorCorrection == QRCode.Quartile) ] [ text "Quartile (25% redundancy)" ]
                , Html.option [ Attrs.value "high", Attrs.selected (model.errorCorrection == QRCode.High) ] [ text "High (30% redundancy)" ]
                ]
            ]
        ]


qrTypeSelect : Model -> Html Msg
qrTypeSelect model =
    div []
        (qrTypes
            |> List.map
                (\qrType ->
                    Html.label []
                        [ Html.input
                            [ Attrs.type_ "radio"
                            , Attrs.checked (clearQRType qrType == clearQRType model.qrType)
                            , Attrs.name "qr_type_select"
                            , onCheck
                                (\checked ->
                                    if checked then
                                        ChangeQRType qrType

                                    else
                                        NoOp
                                )
                            ]
                            []
                        , text <| getQRTypeLabel qrType
                        ]
                )
        )


qrTypeOptions : Model -> Html Msg
qrTypeOptions model =
    case model.qrType of
        QRText value ->
            Html.label []
                [ text "Text"
                , Html.textarea
                    [ onInput <| ChangeQRType << QRText
                    , Attrs.spellcheck True
                    ]
                    [ text value ]
                ]

        QRUrl url ->
            Html.label []
                [ text "URL"
                , Html.input
                    [ onInput <| ChangeQRType << QRUrl
                    , Attrs.spellcheck False
                    , Attrs.value url
                    , Attrs.type_ "url"
                    , Attrs.placeholder "https://example.com"
                    ]
                    []
                ]

        QREmail address subject body ->
            div []
                [ Html.label []
                    [ text "Email address"
                    , Html.input
                        [ onInput <| ChangeQRType << (\val -> QREmail val subject body)
                        , Attrs.type_ "email"
                        , Attrs.value address
                        , Attrs.placeholder "name@example.com"
                        ]
                        []
                    ]
                , Html.label []
                    [ text "Subject"
                    , Html.input
                        [ onInput <| ChangeQRType << (\val -> QREmail address val body)
                        , Attrs.type_ "text"
                        , Attrs.value subject
                        ]
                        []
                    ]
                , Html.label []
                    [ text "Message"
                    , Html.textarea
                        [ onInput <| ChangeQRType << (\val -> QREmail address subject val)
                        , Attrs.spellcheck True
                        ]
                        [ text body ]
                    ]
                ]

        QRWifi ssid password hidden ->
            div []
                [ Html.label []
                    [ text "Network name (SSID)"
                    , Html.input
                        [ onInput <| ChangeQRType << (\val -> QRWifi val password hidden)
                        , Attrs.value ssid
                        , Attrs.type_ "text"
                        ]
                        []
                    ]
                , Html.label []
                    [ text "Network name (SSID)"
                    , Html.input
                        [ onInput <| ChangeQRType << (\val -> QRWifi val password hidden)
                        , Attrs.value ssid
                        , Attrs.type_ "text"
                        ]
                        []
                    ]
                , Html.label [] <|
                    [ text "Password type"
                    , Html.div
                        []
                        ([ ( "wpa", "WPA / WPA2", WPA "" ), ( "wep", "WEP", WEP "" ), ( "none", "None", None ) ]
                            |> List.map
                                (\( value, label, pass_type ) ->
                                    Html.label []
                                        [ Html.input
                                            [ Attrs.type_ "radio"
                                            , Attrs.name "password_type"
                                            , Attrs.value value
                                            , Attrs.checked (clearWifiPassword password == clearWifiPassword pass_type)
                                            , onCheck
                                                (\selected ->
                                                    if selected then
                                                        ChangeQRType <| QRWifi ssid pass_type hidden

                                                    else
                                                        NoOp
                                                )
                                            ]
                                            []
                                        , text label
                                        ]
                                )
                        )
                    ]
                        ++ (case password of
                                WPA wpa ->
                                    [ Html.label []
                                        [ text "Password"
                                        , Html.input
                                            [ onInput <| ChangeQRType << (\val -> QRWifi ssid (WPA val) hidden)
                                            , Attrs.value wpa
                                            , Attrs.type_ "text"
                                            ]
                                            []
                                        ]
                                    ]

                                WEP wep ->
                                    [ Html.label []
                                        [ text "Password"
                                        , Html.input
                                            [ onInput <| ChangeQRType << (\val -> QRWifi ssid (WEP val) hidden)
                                            , Attrs.value wep
                                            , Attrs.type_ "text"
                                            ]
                                            []
                                        ]
                                    ]

                                None ->
                                    []
                           )
                        ++ [ Html.label []
                                [ Html.input
                                    [ Attrs.type_ "checkbox"
                                    , onCheck (\checked -> ChangeQRType <| QRWifi ssid password checked)
                                    ]
                                    []
                                , text "Hidden"
                                ]
                           ]
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


qrCodeImage : Model -> Html Msg
qrCodeImage model =
    case QRCode.fromStringWith model.errorCorrection (encodeQRType model.qrType) of
        Err _ ->
            text "Something went wrong"

        Ok code ->
            div []
                [ QRCode.toSvgWithoutQuietZone
                    [ Attrs.width 200
                    , Attrs.height 200
                    ]
                    code
                , Html.button
                    [ onClick DownloadQRCodeAsPNG ]
                    [ text "Download PNG" ]
                ]

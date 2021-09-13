module Main exposing (..)

-- import Html exposing (..)
-- import Html.Attributes as Attrs
-- import Html.Events exposing (onInput)

import Browser
import Element as El exposing (Element)
import Element.Input as Input
import Html exposing (Html)
import Html.Attributes
import QRCode
import Url


main : Program () Model Msg
main =
    Browser.sandbox { init = init, update = update, view = view }


type alias EmailAddress =
    String


type alias EmailSubject =
    String


type alias EmailMessage =
    String


type QRType
    = QRText String
    | QRUrl String
    | QREmail EmailAddress EmailSubject EmailMessage


qrTypes : List QRType
qrTypes =
    [ QRText ""
    , QRUrl ""
    , QREmail "" "" ""
    ]


type alias QRTypeValue =
    { value : String
    , label : String
    }


getQRTypeValue : QRType -> QRTypeValue
getQRTypeValue qrType =
    case qrType of
        QRText _ ->
            QRTypeValue "text" "Text"

        QRUrl _ ->
            QRTypeValue "url" "URL"

        QREmail _ _ _ ->
            QRTypeValue "email" "Email"


valueToEmptyQRType : String -> QRType
valueToEmptyQRType value =
    qrTypes
        |> List.filter (\x -> (getQRTypeValue x).value == value)
        |> List.head
        |> Maybe.withDefault (QRText "ERROR: value not found")


type alias Model =
    { qrType : QRType
    , errorCorrection : QRCode.ErrorCorrection
    }


type Msg
    = ChangeQRType QRType
    | ChangeErrorCorrection QRCode.ErrorCorrection


init : Model
init =
    { qrType = QRText ""
    , errorCorrection = QRCode.Quartile
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ChangeQRType newType ->
            { model | qrType = newType }

        ChangeErrorCorrection ecc ->
            { model | errorCorrection = ecc }


view : Model -> Html Msg
view model =
    El.layout [] <|
        El.column [ El.paddingXY 48 24 ]
            [ formView model
            , qrCodeImage model
            ]


formView : Model -> Element Msg
formView model =
    El.column []
        [ qrErrorCorrectionSelect model
        , qrTypeSelect model
        , qrTypeOptions model
        ]


qrErrorCorrectionSelect : Model -> Element Msg
qrErrorCorrectionSelect model =
    El.el [ El.paddingXY 0 12 ] <|
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
    El.el [ El.paddingXY 0 12 ] <|
        Input.radioRow
            [ El.spacing 12, El.paddingXY 0 8 ]
            { onChange = ChangeQRType
            , selected = Just model.qrType
            , label = Input.labelAbove [] (El.text "QR type")
            , options = qrTypes |> List.map (\qrType -> Input.option qrType (El.text (getQRTypeValue qrType).label))
            }


qrTypeOptions : Model -> Element Msg
qrTypeOptions model =
    case model.qrType of
        QRText value ->
            El.row []
                [ Input.multiline [ El.width (El.px 400) ]
                    { onChange = ChangeQRType << QRText
                    , text = value
                    , placeholder = Nothing
                    , label = Input.labelAbove [] (El.text "Text")
                    , spellcheck = True
                    }
                ]

        QRUrl url ->
            El.row []
                [ Input.text []
                    { onChange = ChangeQRType << QRUrl
                    , text = url
                    , placeholder = Just <| Input.placeholder [] (El.text "https://example.com")
                    , label = Input.labelAbove [] (El.text "URL")
                    }
                ]

        QREmail address subject body ->
            El.column [ El.spacingXY 0 12 ]
                [ Input.text []
                    { onChange = ChangeQRType << (\val -> QREmail val subject body)
                    , text = address
                    , placeholder = Just <| Input.placeholder [] (El.text "name@example.co")
                    , label = Input.labelAbove [] (El.text "Email address")
                    }
                , Input.text []
                    { onChange = ChangeQRType << (\val -> QREmail address val body)
                    , text = subject
                    , placeholder = Nothing
                    , label = Input.labelAbove [] (El.text "Subject")
                    }
                , Input.multiline [ El.width (El.px 400) ]
                    { onChange = ChangeQRType << (\val -> QREmail address subject val)
                    , text = body
                    , placeholder = Nothing
                    , label = Input.labelAbove [] (El.text "Body")
                    , spellcheck = True
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


qrCodeImage : Model -> Element Msg
qrCodeImage model =
    case QRCode.fromStringWith model.errorCorrection (encodeQRType model.qrType) of
        Err _ ->
            El.text "Something went wrong"

        Ok code ->
            El.html <|
                QRCode.toSvg
                    [ Html.Attributes.width 200
                    , Html.Attributes.height 200
                    ]
                    code

module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes as Attrs
import Html.Events exposing (onInput)
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
    div []
        [ text <| "Selected QR type: " ++ (getQRTypeValue model.qrType).value
        , formView model
        , qrCodeImage model
        ]


formView : Model -> Html Msg
formView model =
    Html.form []
        [ qrErrorCorrectionSelect model
        , qrTypeSelect model
        , div [] (qrTypeOptions model)
        ]


valueToECC : String -> QRCode.ErrorCorrection
valueToECC val =
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
            [ Html.span [] [ text "Error correction" ]
            , Html.select
                [ onInput <| ChangeErrorCorrection << valueToECC
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
                            [ Attrs.value (getQRTypeValue qrType).value
                            , Attrs.name "qr_type"
                            , Attrs.type_ "radio"
                            , Attrs.checked <| (getQRTypeValue qrType).value == (getQRTypeValue model.qrType).value
                            , onInput (ChangeQRType << valueToEmptyQRType)
                            ]
                            []
                        , Html.span [] [ text (getQRTypeValue qrType).label ]
                        ]
                )
        )


qrTypeOptions : Model -> List (Html Msg)
qrTypeOptions model =
    case model.qrType of
        QRText value ->
            [ Html.label []
                [ Html.span [] [ text "Text" ]
                , Html.input
                    [ Attrs.value value
                    , onInput (ChangeQRType << QRText)
                    , Attrs.name "qr_text_value"
                    ]
                    []
                ]
            ]

        QRUrl url ->
            [ Html.label []
                [ Html.span [] [ text "URL" ]
                , Html.input
                    [ Attrs.value url
                    , onInput (ChangeQRType << QRUrl)
                    , Attrs.name "qr_url_value"
                    , Attrs.type_ "url"
                    , Attrs.placeholder "https://example.com"
                    ]
                    []
                ]
            ]

        QREmail address subject body ->
            [ Html.label []
                [ Html.span [] [ text "Email address" ]
                , Html.input
                    [ Attrs.value address
                    , onInput (ChangeQRType << (\val -> QREmail val subject body))
                    , Attrs.name "qr_email_address"
                    , Attrs.type_ "email"
                    , Attrs.placeholder "name@example.com"
                    ]
                    []
                ]
            , Html.label []
                [ Html.span [] [ text "Subject" ]
                , Html.input
                    [ Attrs.value subject
                    , onInput (ChangeQRType << (\val -> QREmail address val body))
                    , Attrs.name "qr_email_subject"
                    , Attrs.type_ "text"
                    ]
                    []
                ]
            , Html.label []
                [ Html.span [] [ text "Body" ]
                , Html.textarea
                    [ Attrs.value body
                    , onInput (ChangeQRType << (\val -> QREmail address subject val))
                    , Attrs.name "qr_email_body"
                    ]
                    []
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


qrCodeImage : Model -> Html Msg
qrCodeImage model =
    case QRCode.fromStringWith model.errorCorrection (encodeQRType model.qrType) of
        Err _ ->
            text "Something went wrong"

        Ok code ->
            QRCode.toSvg
                [ Attrs.width 200
                , Attrs.height 200
                ]
                code

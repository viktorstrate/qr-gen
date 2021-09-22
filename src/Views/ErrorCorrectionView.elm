module Views.ErrorCorrectionView exposing (..)

import Html.Styled as Html exposing (Html, text)
import Html.Styled.Attributes as Attrs
import Html.Styled.Events exposing (onInput)
import Model exposing (Model)
import QRCode exposing (ErrorCorrection)
import State exposing (Msg(..))
import Views.PrimitiveComponents exposing (styledGroup, withLabel)


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
    styledGroup []
        [ withLabel "Error correction" [] <|
            Html.select
                [ onInput (ChangeErrorCorrection << errorCorrectionValueToType)
                ]
                [ Html.option [ Attrs.value "low", Attrs.selected (model.errorCorrection == QRCode.Low) ] [ text "Low (7% redundancy)" ]
                , Html.option [ Attrs.value "medium", Attrs.selected (model.errorCorrection == QRCode.Medium) ] [ text "Medium (15% redundancy)" ]
                , Html.option [ Attrs.value "quartile", Attrs.selected (model.errorCorrection == QRCode.Quartile) ] [ text "Quartile (25% redundancy)" ]
                , Html.option [ Attrs.value "high", Attrs.selected (model.errorCorrection == QRCode.High) ] [ text "High (30% redundancy)" ]
                ]
        ]

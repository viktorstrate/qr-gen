module QRImage exposing (..)

import Css exposing (..)
import Html.Styled as Html exposing (Html, div, fromUnstyled, text)
import Html.Styled.Attributes exposing (css)
import Html.Styled.Events exposing (onClick)
import Model exposing (Model)
import QRCode
import QRTypes exposing (encodeQRType)
import State exposing (Msg(..))


qrCodeImage : Model -> Html Msg
qrCodeImage model =
    case QRCode.fromStringWith model.errorCorrection (encodeQRType model.qrType) of
        Err _ ->
            text "Something went wrong"

        Ok code ->
            div
                [ css
                    [ width (px 200)
                    , height (px 200)
                    ]
                ]
                [ fromUnstyled (QRCode.toSvgWithoutQuietZone [] code)
                , Html.button
                    [ onClick DownloadQRCodeAsPNG ]
                    [ text "Download PNG" ]
                ]

module Views.QRImageView exposing (qrCodeView)

import Css exposing (..)
import Html.Styled as Html exposing (Html, div, fromUnstyled, text)
import Html.Styled.Attributes exposing (css)
import Html.Styled.Events exposing (onClick)
import MediaQueries exposing (withMediaDesktop)
import Model exposing (Model)
import QRCode
import QRTypes exposing (encodeQRType)
import State exposing (Msg(..))
import Views.PrimitiveComponents exposing (styledGroup)


qrCodeView : Model -> Html Msg
qrCodeView model =
    styledGroup
        [ css
            [ flexShrink (int 0)
            , withMediaDesktop
                [ marginLeft (px 6)
                ]
            ]
        ]
        [ qrCodeImage model
        , Html.button
            [ onClick DownloadQRCodeAsPNG, css [ marginTop (px 12) ] ]
            [ text "Download PNG" ]
        ]


qrCodeImage : Model -> Html Msg
qrCodeImage model =
    case QRCode.fromStringWith model.errorCorrection (encodeQRType model.qrType) of
        Err _ ->
            text "Something went wrong"

        Ok code ->
            div
                [ css
                    [ maxWidth (px 200)
                    , maxWidth (px 200)
                    ]
                ]
                [ fromUnstyled (QRCode.toSvgWithoutQuietZone [] code)
                ]

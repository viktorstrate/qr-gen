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
            [ onClick (DownloadQRCodeAsPNG 0xFF 0xFFFFFFFF), css [ marginTop (px 12), display block ] ]
            [ text "Download PNG (white background)" ]
        , Html.button
            [ onClick (DownloadQRCodeAsPNG 0xFF 0xFFFFFF00), css [ marginTop (px 12), display block ] ]
            [ text "Download PNG (transparent background)" ]
        ]


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
                ]

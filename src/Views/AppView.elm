module Views.AppView exposing (appView)

import Css exposing (..)
import Css.Global
import Html.Styled as Html exposing (Html, div, text)
import Html.Styled.Attributes exposing (css)
import MediaQueries exposing (withMediaDesktop)
import Model exposing (Model)
import State exposing (Msg)
import Views.FormView exposing (formView)
import Views.QRImageView exposing (qrCodeView)


globalStyles : Html msg
globalStyles =
    Css.Global.global
        [ Css.Global.selector "body"
            [ backgroundColor (hex "f9f9fc")
            , backgroundImage (url "https://www.toptal.com/designers/subtlepatterns/patterns/email-pattern.png")
            , backgroundAttachment scroll
            , backgroundRepeat repeat
            , padding (px 20)
            , fontFamilies [ "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" ]
            ]
        ]


appView : Model -> Html Msg
appView model =
    div []
        [ Html.h1 [ css [ textAlign center ] ] [ text "QR Code Generator" ]
        , mainContent model
        ]


mainContent : Model -> Html Msg
mainContent model =
    div
        [ css
            [ displayFlex
            , flexDirection column
            , justifyContent center
            , alignItems start
            , marginTop (px 40)
            , withMediaDesktop
                [ flexDirection row
                ]
            ]
        ]
        [ globalStyles
        , formView model
        , qrCodeView model
        ]

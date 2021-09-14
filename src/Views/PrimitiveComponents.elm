module Views.PrimitiveComponents exposing (..)

import Css exposing (..)
import Html.Styled as Html exposing (Attribute, Html, span, text)
import Html.Styled.Attributes exposing (css)
import State exposing (Msg)


withLabel : String -> List (Attribute Msg) -> Html Msg -> Html Msg
withLabel label attrs element =
    Html.label
        attrs
        [ span
            [ css
                [ display block
                , marginBottom (px 6)
                ]
            ]
            [ text label ]
        , element
        ]


styledGroup : List (Attribute msg) -> List (Html msg) -> Html msg
styledGroup =
    Html.styled Html.div
        [ backgroundColor (hex "fff")
        , padding (px 12)
        , border2 (px 1) solid
        , borderColor (hex "eee")
        , borderRadius (px 4)
        ]

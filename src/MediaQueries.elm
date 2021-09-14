module MediaQueries exposing (..)

import Css exposing (..)
import Css.Media as Media exposing (only, screen, withMedia)


withMediaDesktop : List Style -> Style
withMediaDesktop =
    withMedia [ only screen [ Media.minWidth (px 680) ] ]

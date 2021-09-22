module Main exposing (..)

import Browser
import Html.Styled exposing (toUnstyled)
import Model exposing (Model)
import QRCode
import QRTypes exposing (QRType(..))
import State exposing (Msg, update)
import Views.AppView exposing (appView)


main : Program () Model Msg
main =
    Browser.document { init = \() -> init, update = update, view = view, subscriptions = \_ -> Sub.none }


init : ( Model, Cmd Msg )
init =
    ( { qrType = QRText ""
      , errorCorrection = QRCode.Quartile
      }
    , Cmd.none
    )


view : Model -> Browser.Document Msg
view model =
    { title = "QR Code Generator"
    , body = [ toUnstyled <| appView model ]
    }

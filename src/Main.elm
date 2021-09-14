module Main exposing (..)

import Browser
import Css exposing (..)
import Css.Global
import Html.Styled exposing (div, toUnstyled)
import Model exposing (Model)
import QRCode
import QRImage exposing (qrCodeImage)
import QRTypes exposing (QRType(..))
import State exposing (Msg, update)
import Views.FormView exposing (formView)


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
    , body =
        [ toUnstyled
            (div []
                [ Css.Global.global
                    [ Css.Global.selector "body"
                        [ backgroundColor (hex "f9f9fc")
                        , padding (px 20)
                        ]
                    ]
                , formView model
                , qrCodeImage model
                ]
            )
        ]
    }

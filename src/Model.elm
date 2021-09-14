module Model exposing (..)

import QRCode
import QRTypes exposing (QRType)


type alias Model =
    { qrType : QRType
    , errorCorrection : QRCode.ErrorCorrection
    }

module State exposing (..)

import Bytes exposing (Bytes)
import Bytes.Encode
import File.Download as Download
import Image
import Model exposing (Model)
import QRCode exposing (defaultImageOptions)
import QRTypes exposing (QRType, encodeQRType)


generateQRCodePngUrl : ( Int, Int ) -> Model -> Bytes
generateQRCodePngUrl ( fg, bg ) model =
    case QRCode.fromStringWith model.errorCorrection (encodeQRType model.qrType) of
        Err _ ->
            Bytes.Encode.encode <| Bytes.Encode.string "ERROR"

        Ok code ->
            Image.toPng
                (QRCode.toImageWithOptions
                    { defaultImageOptions
                        | moduleSize = 10
                        , darkColor = fg
                        , lightColor = bg
                    }
                    code
                )


type Msg
    = ChangeQRType QRType
    | ChangeErrorCorrection QRCode.ErrorCorrection
    | DownloadQRCodeAsPNG Int Int -- foreground and background color
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeQRType newType ->
            ( { model | qrType = newType }, Cmd.none )

        ChangeErrorCorrection ecc ->
            ( { model | errorCorrection = ecc }, Cmd.none )

        DownloadQRCodeAsPNG fg bg ->
            ( model, Download.bytes "qrcode.png" "image/png" (generateQRCodePngUrl ( fg, bg ) model) )

        NoOp ->
            ( model, Cmd.none )

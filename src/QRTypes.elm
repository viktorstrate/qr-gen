module QRTypes exposing (..)

import Url


type QRType
    = QRText String
    | QRUrl String
    | QREmail EmailAddress EmailSubject EmailMessage
    | QRWifi WifiSSID WifiPassword WifiHidden


type alias EmailAddress =
    String


type alias EmailSubject =
    String


type alias EmailMessage =
    String


type alias WifiSSID =
    String


type WifiPassword
    = WifiWPA String
    | WifiWEP String
    | WifiNone


type alias WifiHidden =
    Bool


clearWifiPassword : WifiPassword -> WifiPassword
clearWifiPassword password =
    case password of
        WifiWPA _ ->
            WifiWPA ""

        WifiWEP _ ->
            WifiWEP ""

        WifiNone ->
            WifiNone


qrTypes : List QRType
qrTypes =
    [ QRText ""
    , QRUrl ""
    , QREmail "" "" ""
    , QRWifi "" (WifiWPA "") False
    ]


getQRTypeLabel : QRType -> String
getQRTypeLabel qrType =
    case qrType of
        QRText _ ->
            "Text"

        QRUrl _ ->
            "URL"

        QREmail _ _ _ ->
            "Email"

        QRWifi _ _ _ ->
            "Wifi"


clearQRType : QRType -> QRType
clearQRType qrType =
    case qrType of
        QRText _ ->
            QRText ""

        QRUrl _ ->
            QRUrl ""

        QREmail _ _ _ ->
            QREmail "" "" ""

        QRWifi _ _ _ ->
            QRWifi "" (WifiWPA "") False


encodeQRType : QRType -> String
encodeQRType qrType =
    case qrType of
        QRText value ->
            value

        QRUrl url ->
            url

        QREmail address subject message ->
            "mailto:" ++ Url.percentEncode address ++ "?subject=" ++ Url.percentEncode subject ++ "&body=" ++ Url.percentEncode message

        QRWifi ssid password hidden ->
            let
                escapeStr =
                    String.replace ";" "\\;"

                formattedPassword =
                    case password of
                        WifiWPA pass ->
                            "P:" ++ escapeStr pass ++ ";"

                        WifiWEP pass ->
                            "P:" ++ escapeStr pass ++ ";"

                        WifiNone ->
                            ""

                formattedPasswordType =
                    case password of
                        WifiWPA _ ->
                            "T:WPA;"

                        WifiWEP _ ->
                            "T:WEP;"

                        WifiNone ->
                            ""

                formattedSSID =
                    "S:" ++ escapeStr ssid ++ ";"

                formattedHidden =
                    if hidden then
                        "H:true;"

                    else
                        ""
            in
            "WIFI:" ++ formattedPasswordType ++ formattedSSID ++ formattedPassword ++ formattedHidden ++ ";"

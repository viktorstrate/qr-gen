module QRTypes exposing (..)

import Url


type QRType
    = QRText String
    | QRUrl String
    | QREmail EmailAddress EmailSubject EmailMessage
    | QRWifi WifiSSID WifiPassword WifiHidden
    | QRPhone String
    | QRSms String String
    | QRTweet String
    | QRCrypto Cryptocurrency String String String


qrTypes : List QRType
qrTypes =
    [ QRText ""
    , QRUrl ""
    , QREmail "" "" ""
    , QRWifi "" (WifiWPA "") False
    , QRPhone ""
    , QRSms "" ""
    , QRTweet ""
    , QRCrypto Bitcoin "" "" ""
    ]


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


type Cryptocurrency
    = Bitcoin
    | BitcoinCash
    | Ethereum
    | Litecoin
    | Dash


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

        QRPhone _ ->
            "Phone"

        QRSms _ _ ->
            "SMS"

        QRTweet _ ->
            "Tweet"

        QRCrypto _ _ _ _ ->
            "Crypto"


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

        QRPhone _ ->
            QRPhone ""

        QRSms _ _ ->
            QRSms "" ""

        QRTweet _ ->
            QRTweet ""

        QRCrypto _ _ _ _ ->
            QRCrypto Bitcoin "" "" ""


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

        QRPhone number ->
            "tel:" ++ number

        QRSms number message ->
            "SMSTO:" ++ number ++ ":" ++ message

        QRTweet message ->
            "https://twitter.com/intent/tweet?text=" ++ Url.percentEncode message

        QRCrypto currency address amount message ->
            let
                formattedCurrency =
                    case currency of
                        Bitcoin ->
                            "bitcoin"

                        BitcoinCash ->
                            "bitcoincash"

                        Ethereum ->
                            "ethereum"

                        Litecoin ->
                            "litecoin"

                        Dash ->
                            "dash"
            in
            formattedCurrency ++ ":" ++ Url.percentEncode address ++ "?amount=" ++ Url.percentEncode amount ++ "&message=" ++ Url.percentEncode message

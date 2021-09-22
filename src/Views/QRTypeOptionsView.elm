module Views.QRTypeOptionsView exposing (qrTypeOptions)

import Css exposing (..)
import Html.Styled as Html exposing (Attribute, Html, div, text)
import Html.Styled.Attributes as Attrs exposing (css)
import Html.Styled.Events exposing (onCheck, onInput)
import Model exposing (Model)
import QRTypes exposing (..)
import State exposing (Msg(..))
import Views.PrimitiveComponents exposing (styledGroup, withLabel)


qrTypeOptions : Model -> Html Msg
qrTypeOptions model =
    styledGroup []
        [ case model.qrType of
            QRText value ->
                textOptions value

            QRUrl url ->
                urlOptions url

            QREmail address subject body ->
                emailOptions address subject body

            QRWifi ssid password hidden ->
                wifiOptions ssid password hidden

            QRPhone number ->
                phoneOptions number

            QRSms number message ->
                smsOptions number message

            QRTweet message ->
                tweetOptions message

            QRCrypto currency address amount message ->
                cryptoOptions currency address amount message
        ]


inputSpacingStyles : Attribute Msg
inputSpacingStyles =
    css
        [ display block
        , marginBottom (px 12)
        ]


textOptions : String -> Html Msg
textOptions value =
    withLabel "Text" [] <|
        Html.textarea
            [ onInput <| ChangeQRType << QRText
            , Attrs.spellcheck True
            , css
                [ width (pct 100)
                , height (px 100)
                , maxWidth (pct 100)
                ]
            ]
            [ text value ]


urlOptions : String -> Html Msg
urlOptions url =
    withLabel "URL" [] <|
        Html.input
            [ onInput <| ChangeQRType << QRUrl
            , Attrs.spellcheck False
            , Attrs.value url
            , Attrs.type_ "url"
            , Attrs.placeholder "https://example.com"
            ]
            []


emailOptions : String -> EmailSubject -> EmailMessage -> Html Msg
emailOptions address subject body =
    div []
        [ withLabel "Email address" [ inputSpacingStyles ] <|
            Html.input
                [ onInput <| ChangeQRType << (\val -> QREmail val subject body)
                , Attrs.type_ "email"
                , Attrs.value address
                , Attrs.placeholder "name@example.com"
                ]
                []
        , withLabel "Subject" [ inputSpacingStyles ] <|
            Html.input
                [ onInput <| ChangeQRType << (\val -> QREmail address val body)
                , Attrs.type_ "text"
                , Attrs.value subject
                ]
                []
        , withLabel "Message" [] <|
            Html.textarea
                [ onInput <| ChangeQRType << (\val -> QREmail address subject val)
                , Attrs.spellcheck True
                , css
                    [ width (pct 100)
                    , height (px 100)
                    , maxWidth (pct 100)
                    ]
                ]
                [ text body ]
        ]


wifiOptions : String -> WifiPassword -> WifiHidden -> Html Msg
wifiOptions ssid password hidden =
    div []
        ([ withLabel "Network name (SSID)" [ inputSpacingStyles ] <|
            Html.input
                [ onInput <| ChangeQRType << (\val -> QRWifi val password hidden)
                , Attrs.value ssid
                , Attrs.type_ "text"
                ]
                []
         , withLabel "Password type" [ inputSpacingStyles ] <|
            Html.div
                []
                ([ ( "wpa", "WPA / WPA2", WifiWPA "" ), ( "wep", "WEP", WifiWEP "" ), ( "none", "None", WifiNone ) ]
                    |> List.map
                        (\( value, label, pass_type ) ->
                            Html.label []
                                [ Html.input
                                    [ Attrs.type_ "radio"
                                    , Attrs.name "password_type"
                                    , Attrs.value value
                                    , Attrs.checked (clearWifiPassword password == clearWifiPassword pass_type)
                                    , onCheck
                                        (\selected ->
                                            if selected then
                                                ChangeQRType <| QRWifi ssid pass_type hidden

                                            else
                                                NoOp
                                        )
                                    ]
                                    []
                                , text label
                                ]
                        )
                )
         ]
            ++ wifiPasswordTypeOptions ssid password hidden
            ++ [ Html.label
                    [ css
                        [ display block
                        ]
                    ]
                    [ Html.input
                        [ Attrs.type_ "checkbox"
                        , onCheck (\checked -> ChangeQRType <| QRWifi ssid password checked)
                        ]
                        []
                    , text "Hidden"
                    ]
               ]
        )


wifiPasswordTypeOptions : String -> WifiPassword -> WifiHidden -> List (Html Msg)
wifiPasswordTypeOptions ssid password hidden =
    case password of
        WifiWPA wpa ->
            [ withLabel "Password" [ inputSpacingStyles ] <|
                Html.input
                    [ onInput <| ChangeQRType << (\val -> QRWifi ssid (WifiWPA val) hidden)
                    , Attrs.value wpa
                    , Attrs.type_ "text"
                    ]
                    []
            ]

        WifiWEP wep ->
            [ withLabel "Password" [ inputSpacingStyles ] <|
                Html.input
                    [ onInput <| ChangeQRType << (\val -> QRWifi ssid (WifiWEP val) hidden)
                    , Attrs.value wep
                    , Attrs.type_ "text"
                    ]
                    []
            ]

        WifiNone ->
            []


smsOptions : String -> String -> Html Msg
smsOptions number message =
    div []
        [ withLabel "Number" [ inputSpacingStyles ] <|
            Html.input
                [ onInput <| ChangeQRType << (\val -> QRSms val message)
                , Attrs.value number
                , Attrs.type_ "tel"
                ]
                []
        , withLabel "Message" [] <|
            Html.textarea
                [ onInput <| ChangeQRType << (\val -> QRSms number val)
                , Attrs.spellcheck True
                , css
                    [ width (pct 100)
                    , height (px 100)
                    , maxWidth (pct 100)
                    ]
                ]
                [ text message ]
        ]


phoneOptions : String -> Html Msg
phoneOptions number =
    div []
        [ withLabel "Number" [] <|
            Html.input
                [ onInput <| ChangeQRType << QRPhone
                , Attrs.value number
                , Attrs.type_ "tel"
                ]
                []
        ]


tweetOptions : String -> Html Msg
tweetOptions message =
    div []
        [ withLabel "Message" [] <|
            Html.textarea
                [ onInput <| ChangeQRType << QRTweet
                , Attrs.spellcheck True
                , css
                    [ width (pct 100)
                    , height (px 100)
                    , maxWidth (pct 100)
                    ]
                ]
                [ text message ]
        ]


cryptoOptions : Cryptocurrency -> String -> String -> String -> Html Msg
cryptoOptions currency address amount message =
    div []
        [ withLabel "Crypto currency" [ inputSpacingStyles ] <|
            Html.div
                []
                ([ ( "bitcoin", "Bitcoin", Bitcoin ), ( "bitcoin-cash", "Bitcoin Cash", BitcoinCash ), ( "ethereum", "Ethereum", Ethereum ), ( "litecoin", "Litecoin", Litecoin ) ]
                    |> List.map
                        (\( value, label, currency_ ) ->
                            Html.label []
                                [ Html.input
                                    [ Attrs.type_ "radio"
                                    , Attrs.name "crypto_currency"
                                    , Attrs.value value
                                    , Attrs.checked (currency == currency_)
                                    , onCheck
                                        (\selected ->
                                            if selected then
                                                ChangeQRType <| QRCrypto currency_ address amount message

                                            else
                                                NoOp
                                        )
                                    ]
                                    []
                                , text label
                                ]
                        )
                )
        , withLabel "Receiver address" [ inputSpacingStyles ] <|
            Html.input
                [ onInput <| ChangeQRType << (\val -> QRCrypto currency val amount message)
                , Attrs.value address
                , Attrs.type_ "text"
                ]
                []
        , withLabel "Amount" [] <|
            Html.input
                [ onInput <| ChangeQRType << (\val -> QRCrypto currency address val message)
                , Attrs.value amount
                , Attrs.type_ "text"
                ]
                []
        ]

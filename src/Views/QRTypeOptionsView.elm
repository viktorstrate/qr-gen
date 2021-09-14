module Views.QRTypeOptionsView exposing (qrTypeOptions)

import Css exposing (..)
import Html.Styled as Html exposing (Html, div, text)
import Html.Styled.Attributes as Attrs exposing (css)
import Html.Styled.Events exposing (onCheck, onClick, onInput)
import Model exposing (Model)
import QRTypes exposing (..)
import State exposing (Msg(..))


qrTypeOptions : Model -> Html Msg
qrTypeOptions model =
    case model.qrType of
        QRText value ->
            textOptions value

        QRUrl url ->
            urlOptions url

        QREmail address subject body ->
            emailOptions address subject body

        QRWifi ssid password hidden ->
            wifiOptions ssid password hidden


textOptions : String -> Html Msg
textOptions value =
    Html.label []
        [ text "Text"
        , Html.textarea
            [ onInput <| ChangeQRType << QRText
            , Attrs.spellcheck True
            ]
            [ text value ]
        ]


urlOptions : String -> Html Msg
urlOptions url =
    Html.label []
        [ text "URL"
        , Html.input
            [ onInput <| ChangeQRType << QRUrl
            , Attrs.spellcheck False
            , Attrs.value url
            , Attrs.type_ "url"
            , Attrs.placeholder "https://example.com"
            ]
            []
        ]


emailOptions : String -> EmailSubject -> EmailMessage -> Html Msg
emailOptions address subject body =
    div []
        [ Html.label []
            [ text "Email address"
            , Html.input
                [ onInput <| ChangeQRType << (\val -> QREmail val subject body)
                , Attrs.type_ "email"
                , Attrs.value address
                , Attrs.placeholder "name@example.com"
                ]
                []
            ]
        , Html.label []
            [ text "Subject"
            , Html.input
                [ onInput <| ChangeQRType << (\val -> QREmail address val body)
                , Attrs.type_ "text"
                , Attrs.value subject
                ]
                []
            ]
        , Html.label []
            [ text "Message"
            , Html.textarea
                [ onInput <| ChangeQRType << (\val -> QREmail address subject val)
                , Attrs.spellcheck True
                ]
                [ text body ]
            ]
        ]


wifiOptions ssid password hidden =
    div []
        [ Html.label []
            [ text "Network name (SSID)"
            , Html.input
                [ onInput <| ChangeQRType << (\val -> QRWifi val password hidden)
                , Attrs.value ssid
                , Attrs.type_ "text"
                ]
                []
            ]
        , Html.label []
            [ text "Network name (SSID)"
            , Html.input
                [ onInput <| ChangeQRType << (\val -> QRWifi val password hidden)
                , Attrs.value ssid
                , Attrs.type_ "text"
                ]
                []
            ]
        , Html.label [] <|
            [ text "Password type"
            , Html.div
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
                ++ (case password of
                        WifiWPA wpa ->
                            [ Html.label []
                                [ text "Password"
                                , Html.input
                                    [ onInput <| ChangeQRType << (\val -> QRWifi ssid (WifiWPA val) hidden)
                                    , Attrs.value wpa
                                    , Attrs.type_ "text"
                                    ]
                                    []
                                ]
                            ]

                        WifiWEP wep ->
                            [ Html.label []
                                [ text "Password"
                                , Html.input
                                    [ onInput <| ChangeQRType << (\val -> QRWifi ssid (WifiWEP val) hidden)
                                    , Attrs.value wep
                                    , Attrs.type_ "text"
                                    ]
                                    []
                                ]
                            ]

                        WifiNone ->
                            []
                   )
                ++ [ Html.label []
                        [ Html.input
                            [ Attrs.type_ "checkbox"
                            , onCheck (\checked -> ChangeQRType <| QRWifi ssid password checked)
                            ]
                            []
                        , text "Hidden"
                        ]
                   ]
        ]

module Views.FormView exposing (..)

import Css exposing (..)
import Css.Global exposing (children, everything)
import Html.Styled as Html exposing (Html, text)
import Html.Styled.Attributes as Attrs exposing (css)
import Html.Styled.Events exposing (onCheck)
import MediaQueries exposing (withMediaDesktop)
import Model exposing (Model)
import QRTypes exposing (clearQRType, getQRTypeLabel, qrTypes)
import State exposing (Msg(..))
import Views.ErrorCorrectionView exposing (qrErrorCorrectionSelect)
import Views.PrimitiveComponents exposing (styledGroup)
import Views.QRTypeOptionsView exposing (qrTypeOptions)


formView : Model -> Html Msg
formView model =
    Html.form
        [ css
            [ displayFlex
            , flexDirection column
            , flexGrow (int 1)
            , flexShrink (int 1)
            , width (pct 100)
            , children
                [ everything
                    [ marginBottom (px 12)
                    ]
                ]
            , withMediaDesktop
                [ marginRight (px 6)
                , maxWidth (px 600)
                ]
            ]
        ]
        [ qrTypeSelect model
        , qrTypeOptions model
        , qrErrorCorrectionSelect model
        ]


qrTypeSelect : Model -> Html Msg
qrTypeSelect model =
    styledGroup
        []
        (qrTypes
            |> List.map
                (\qrType ->
                    Html.label
                        [ css
                            [ marginRight (px 10)
                            ]
                        ]
                        [ Html.input
                            [ Attrs.type_ "radio"
                            , Attrs.checked (clearQRType qrType == clearQRType model.qrType)
                            , Attrs.name "qr_type_select"
                            , onCheck
                                (\checked ->
                                    if checked then
                                        ChangeQRType qrType

                                    else
                                        NoOp
                                )
                            ]
                            []
                        , text <| getQRTypeLabel qrType
                        ]
                )
        )

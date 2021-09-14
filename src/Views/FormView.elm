module Views.FormView exposing (..)

import Css exposing (..)
import Css.Global exposing (children, everything)
import Html.Styled as Html exposing (Html, div, text)
import Html.Styled.Attributes as Attrs exposing (css)
import Html.Styled.Events exposing (onCheck)
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
            , children
                [ everything
                    [ margin2 (px 6) (px 0)
                    ]
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
                    Html.label []
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

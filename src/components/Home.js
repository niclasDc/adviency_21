import {useEffect, useMemo, useRef, useState} from "react";
import {DocumentDuplicateIcon, EyeIcon, GiftIcon, PrinterIcon} from "@heroicons/react/24/outline";
import {TrashIcon, XMarkIcon} from "@heroicons/react/24/solid";
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import {useReactToPrint} from "react-to-print";
import gift_christmas_tree from '../img/gift_christmas_tree.png';

function Home() {

    const [gifts, setGifts] = useState([]);

    const [giftEdit, setGiftEdit] = useState(null);

    const [buttonsModal, setButtonsModal] = useState(false);

    const total = useMemo(() => {
        return gifts.reduce((acc, gift) => {
            return acc + gift.totalPrice;
        }, 0);
    }, [gifts]);

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        const gifts = JSON.parse(localStorage.getItem('gifts'));
        if (gifts?.length) {
            setGifts(gifts)
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('gifts', JSON.stringify(gifts));
    }, [gifts]);

    function handleRemoveAllGifts() {
        return setGifts([])
    }

    function handleRemoveGift(giftRemove) {
        setGifts((gifts) => {
            return gifts.filter((gift) => gift.id !== giftRemove.id)
        });
    }

    function handleUpdateGift(giftUpdate) {
        return setGiftEdit(giftUpdate);
    }

    function handleDuplicateGift(giftDuplicate) {
        return setGiftEdit({
            id: null,
            name: giftDuplicate.name,
            recipient: giftDuplicate.recipient,
            count: giftDuplicate.count,
            url_img: giftDuplicate.url_img,
            totalPrice: giftDuplicate.totalPrice
        })
    }

    const renderGifts = gifts.map((gift) => {
        return (
            <li className="p-3" key={gift.id}>
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 justify-center">
                        <img className="w-14 h-14 rounded-full" src={gift.url_img} alt={gift.url_img}/>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{gift.name} ({gift.count}) - $ {gift.totalPrice}</p>
                        <p className="text-sm truncate italic">{gift.recipient}</p>
                    </div>

                    {buttonsModal ? null
                        :
                        <div className="grid grid-cols-3 items-center space-x-2">
                            <button type="button" className="justify-center items-center"
                                    data-bs-toggle="modal" data-bs-target="#form-gift"
                                    onClick={() => handleUpdateGift(gift)}>
                                <PencilSquareIcon className="h-5 w-5"/>
                            </button>

                            <button type="button" className="justify-center items-center"
                                    data-bs-toggle="modal" data-bs-target="#form-gift"
                                    onClick={() => handleDuplicateGift(gift)}>
                                <DocumentDuplicateIcon className="h-5 w-5"/>
                            </button>

                            <button type="button" onClick={() => handleRemoveGift(gift)}
                                    className="justify-center items-center">
                                <XMarkIcon className="h-5 w-5"/>
                            </button>

                        </div>
                    }
                </div>
            </li>
        )
    });

    const renderForm = () => {
        return (
            <div id="form-gift" data-bs-backdrop="static" data-bs-keyborad="false" tabIndex="-1"
                 aria-labelledby="formLabel" aria-hidden="true"
                 className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto">
                <div className="modal-dialog relative w-auto pointer-events-none">
                    <div
                        className="modal-content border-none shadow-lg relative flex flex-col pointer-events-auto bg-white rounded-md outline-none text-current">
                        <div
                            className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-pewter-gray rounded-t-md">
                            {giftEdit ?
                                <h5 className="text-3xl font-medium leading-normal text-pewter-gray"> Editar
                                    Regalo </h5> :
                                <h5 className="text-3xl font-medium leading-normal text-pewter-gray"> Registrar
                                    Regalo </h5>}
                            <button type="button" data-bs-dismiss="modal" aria-label="Close"
                                    className="btn-close box-content w-4 h-4 p-1 text-pewter-gray border-none rounded-none">
                            </button>
                        </div>

                        <div className="modal-body relative mt-4 px-6 py-4">
                            <Formik
                                initialValues={{
                                    id: giftEdit ? giftEdit.id : null,
                                    name: giftEdit ? giftEdit.name : '',
                                    recipient: giftEdit ? giftEdit.recipient : '',
                                    count: giftEdit ? giftEdit.count : 1,
                                    url_img: giftEdit ? giftEdit.url_img : '',
                                    price: giftEdit ? (giftEdit.totalPrice / giftEdit.count) : 1
                                }}
                                validationSchema={Yup.object({
                                    name: Yup.string()
                                        .max(20, 'El regalo debe tener 20 caracteres o menos.')
                                        .min(3, "El regalo debe tener 3 caracteres o más.")
                                        .required('Qué regalo deseas? 🤔'),
                                    count: Yup.number()
                                        .min(1, 'El número de regalos debe ser mayor a 0')
                                        .max(100, 'El número de regalos debe ser menor a 100')
                                        .required('Cuántos de este regalo deseas? 🤔'),
                                    recipient: Yup.string()
                                        .min(3, 'El nombre debe tener 3 caracteres o más')
                                        .max(20, 'El nombre debe tener 20 caracteres o más')
                                        .required('A quien se lo vas a dar? 🤔'),
                                    url_img: Yup.string().url()
                                        .required('Queremos ver el regalo, coloca un enlace de la img 🤔'),
                                    price: Yup.number()
                                        .min(1, 'El precio del regalo debe ser mayor a cero')
                                        .required('Cuál es el precio del regalo? 🤔')
                                })}
                                onSubmit={(values, {resetForm}) => {
                                    if (values.id !== null) {
                                        resetForm();
                                        setGifts((gifts) => {
                                            return gifts.map((giftA) =>
                                                giftA.id === values.id ? {
                                                    id: values.id,
                                                    name: values.name,
                                                    recipient: values.recipient,
                                                    count: values.count,
                                                    url_img: values.url_img,
                                                    totalPrice: values.price * values.count
                                                } : giftA
                                            )
                                        })
                                    } else {
                                        resetForm();
                                        setGifts((gifts) => {
                                            return gifts.concat({
                                                id: gifts.length !== 0 ? gifts[gifts.length - 1].id + 1 : 0,
                                                name: values.name,
                                                recipient: values.recipient,
                                                url_img: values.url_img,
                                                count: values.count,
                                                totalPrice: values.count * values.price
                                            })
                                        })
                                    }
                                }}
                                enableReinitialize
                            >
                                <Form>
                                    {giftEdit ?
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3 mb-6">
                                                <label htmlFor="name">Nombre del regalo: </label>
                                                <Field name="name"
                                                       type="text"
                                                       placeholder="Regalo"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="name" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-2/3 px-3 mb-6">
                                                <label htmlFor="recipient">Destinatario: </label>
                                                <Field name="recipient"
                                                       type="text"
                                                       placeholder="Para:"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="recipient" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-1/3 px-3 mb-6">
                                                <label htmlFor="price">Precio: </label>
                                                <Field name="price"
                                                       type="number"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="price" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-2/3 px-3 mb-4">
                                                <label htmlFor="url_img">Url Imagen: </label>
                                                <Field name="url_img"
                                                       type="text"
                                                       placeholder="http://"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="url_img" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-1/3 px-3 mb-6">
                                                <label htmlFor="count"># Regalos: </label>
                                                <Field name="count"
                                                       type="number"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="count" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-full items-center grid justify-items-center">
                                                <button type="submit" data-bs-dismiss="modal"
                                                        className="shadow bg-golden-brown mt-6 py-2 px-4 rounded items-center inline-flex border border-autumn-gold text-pewter-gray">
                                                    Guardar Cambios
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        <div className="flex flex-wrap -mx-3 mb-6">
                                            <div className="w-full px-3 mb-6">
                                                <label htmlFor="name">Nombre del regalo: </label>
                                                <Field name="name"
                                                       type="text"
                                                       placeholder="Regalo"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="name" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-2/3 px-3 mb-6">
                                                <label htmlFor="recipient">Destinatario: </label>
                                                <Field name="recipient"
                                                       type="text"
                                                       placeholder="Para:"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="recipient" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-1/3 px-3 mb-6">
                                                <label htmlFor="count"># Regalos: </label>
                                                <Field name="count"
                                                       type="number"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="count" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-2/3 px-3 mb-4">
                                                <label htmlFor="url_img">Url Imagen: </label>
                                                <Field name="url_img"
                                                       type="text"
                                                       placeholder="http://"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="url_img" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-1/3 px-3 mb-4">
                                                <label htmlFor="price">Precio: </label>
                                                <Field name="price"
                                                       type="number"
                                                       className="appearance-none block w-full bg-very-light-gray text-pewter-gray border border-gray-500 rounded py-3 px-4 mB-3 leading-tight"/>
                                                <ErrorMessage name="price" className="text-red-500 text-xs"/>
                                            </div>

                                            <div className="w-full items-center grid justify-items-center">
                                                <button type="submit" data-bs-dismiss="modal"
                                                        className="shadow bg-golden-brown mt-6 py-2 px-4 rounded items-center inline-flex border border-autumn-gold text-pewter-gray">
                                                    Registrar Regalo
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderPrevisual = () => {

        return (
            <div id="modal-previsual" data-bs-backdrop="static" data-bs-keyborad="false" tabIndex="-1"
                 aria-labelledby="modalLabel" aria-hidden="true"
                 className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto">
                <div className="modal-dialog relative w-auto pointer-events-none">
                    <div
                        className="modal-content border-none shadow-lg relative flex flex-col pointer-events-auto bg-white rounded-md outline-none text-current">
                        <div
                            className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-3xl font-medium leading-normal text-pewter-gray"> Comprar Regalos </h5>
                            <button type="button" data-bs-dismiss="modal" aria-label="Close"
                                    onClick={() => setButtonsModal(false)}
                                    className="btn-close box-content w-4 h-4 p-1 text-pewter-gray border-none rounded-none">
                            </button>
                        </div>

                        <div ref={componentRef} className="modal-body relative px-4 py-4">
                            <ul className="divide-y divide-gray-200">
                                {renderGifts}
                            </ul>
                        </div>

                        <div
                            className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                            <button data-modal-toggle="staticModal" type="button"
                                    onClick={handlePrint}
                                    className="shadow bg-autumn-gold px-5 py-2.5 rounded font-medium text-sm rounded-lg items-center inline-flex border border-autumn-gold text-white">
                                <PrinterIcon className="w-5 h-5 mr-2"/>
                                Imprimir
                            </button>
                            <button data-modal-toggle="staticModal" type="button"
                                    data-bs-dismiss="modal"
                                    onClick={() => setButtonsModal(false)}
                                    className="text-gray-500 bg-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5">Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="grid justify-items-center">
            <div className="mt-6 w-full max-w-md border-1 bg-golden-brown text-pewter-gray rounded-md shadow-md">
                <div className="bg-fern rounded-t-md flex justify-center">
                    <h5 className="text-2xl font-semibold py-2">🎁 Lista de Regalos</h5>
                </div>
                {!(gifts?.length) ?
                    <div className="grid justify-items-center">
                        <img className="w-2/3" src={gift_christmas_tree} alt="gift_christmas_tree"/>
                        <h5 className="text-xl m-2">🎅: No deseas algún regalo?</h5>
                    </div>
                    :
                    <div className="flow-root divide-y divide-pewter-gray">
                        <ul className="divide-y divide-pewter-gray">
                            {renderGifts}
                        </ul>
                        <div className="flex py-2 items-center divide-x divide-pewter-gray">
                            <div className="w-5/6 justify-center flex">
                                <strong>Total: ${total}</strong>
                            </div>
                            <button type="button" onClick={() => setButtonsModal(true)}
                                    data-bs-toggle="modal" data-bs-target="#modal-previsual"
                                    className="w-1/6 flex justify-center">
                                <EyeIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        {renderPrevisual()}
                    </div>
                }

                <div className="grid grid-cols-2 items-center py-2 rounded-b-md bg-fern divide-x divide-pewter-gray">
                    <button type="button" className="inline-flex justify-center"
                            data-bs-toggle="modal" data-bs-target="#form-gift"
                            onClick={() => setGiftEdit(null)}>
                        <GiftIcon className="w-5 h-5 mr-2"/>
                        Añadir regalo
                    </button>
                    <button type="button" onClick={() => handleRemoveAllGifts()} className="inline-flex justify-center">
                        <TrashIcon className="w-5 h-5 mr-2"/>
                        Eliminar los regalos
                    </button>
                </div>

                {renderForm()}

            </div>
        </div>
    )
}

export default Home;
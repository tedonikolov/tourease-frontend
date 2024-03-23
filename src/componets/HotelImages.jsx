import {useMutation, useQuery} from "@tanstack/react-query";
import {deleteImage, getImages, insertImage} from "../hooks/hotel";
import {toast} from "react-toastify";
import CustomToastContent from "./CustomToastContent";
import React from "react";
import {useTranslation} from "react-i18next";
import {Button, Image} from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';
import NoDataComponent from "./NoDataComponent";


export default function HotelImages({hotel}) {
    const {t} = useTranslation("translation", {keyPrefix: "common"});

    const {data: images, refetch} = useQuery({
        queryKey: ["get images", hotel.id],
        queryFn: () => hotel.id && getImages(hotel.id)
    })

    const {mutate: savePic} = useMutation({
        mutationFn: insertImage,
        onSuccess: () => {
            refetch(hotel.id);
            toast.success(<CustomToastContent content={[t("successImage")]}/>);
        }
    });

    const {mutate: removePic} = useMutation({
        mutationFn: deleteImage,
        onSuccess: () => {
            refetch(hotel.id);
            toast.success(<CustomToastContent content={[t("successDelete")]}/>);
        }
    });

    return (
        <div>
            {hotel.id !== 0 ? <div>
                {images && images.length>0 && <Carousel>
                    {images.map((image, key) =>
                        <Carousel.Item key={key}>
                            <Image className={"hotel-info-image"} src={image.startsWith("http") ? image : process.env.REACT_APP_API_URL + image}></Image>
                            <Carousel.Caption className={"caption"}>
                                <Button className={"main-button"} onClick={()=>removePic(image.split("/").pop())}>{t("Remove")}</Button>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )}
                </Carousel>}
                <input
                    className={"custom-file-upload"}
                    type="file"
                    name="myImage"
                    onChange={(event) => {
                        savePic({image: event.target.files[0], hotelId: hotel.id})
                    }}
                />
            </div>
                :
                <div>
                    <NoDataComponent sentence={"Save first hotel info"}/>
                </div>
            }
        </div>
    )
}
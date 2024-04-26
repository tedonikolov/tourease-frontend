import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar, faStarHalf} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function checkStars(stars) {
    switch (stars) {
        case "ONE": {
            return <FontAwesomeIcon color='orange' icon={faStar}/>;
        }
        case "TWO": {
            return (<div><FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/></div>);
        }
        case "THREE": {
            return (<div><FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/></div>);
        }
        case "FOUR": {
            return (<div><FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/></div>);
        }
        case "FIVE": {
            return (<div><FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/>
                <FontAwesomeIcon color='orange' icon={faStar}/></div>);
        }
        case "NONE": {
            return <></>;
        }
        default: {
            return stars;
        }
    }
}

export function checkRating(rating) {
    if (rating < 0.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 1.4) {
        return <div>FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 1.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 2.4) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 2.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 3.4) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 3.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 4.4) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 4.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 5.4) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 5.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 6.4) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 6.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 7.4) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 7.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 8.4) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 8.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 9.4) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='grey' icon={faStar}/></div>;
    } else if (rating < 9.9) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStarHalf}/></div>;
    } else if (rating <= 10) {
        return <div><FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/>
            <FontAwesomeIcon color='blue' icon={faStar}/></div>;
    } else {
        return <></>;
    }
}
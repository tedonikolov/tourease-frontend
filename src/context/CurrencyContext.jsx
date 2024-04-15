import {createContext, useState} from "react";
import i18n from "../i18n";
import {useQuery} from "@tanstack/react-query";
import {getCurrencyRates} from "../hooks/configurations";

export const CurrencyContext = createContext();

export default function CurrencyProvider({children}) {
    const [currency, setCurrency] = useState(i18n.language === "us" ? "EUR" : "BGN");

    const {data: currencies} = useQuery({
        queryKey: ["get currency rates"],
        queryFn: () => getCurrencyRates(),
        retry: false,
        staleTime: 5000
    })

    function handleRate(oldCurrency, newCurrency){
        return currencies.filter((rate) => rate.currency === newCurrency).map((currency) => {
            switch (oldCurrency.currency) {
                case "USD":
                    return currency.rateUSD;
                case "EUR":
                    return currency.rateEUR;
                case "BGN":
                    return currency.rateBGN;
                case "GBP":
                    return currency.rateEUR;
                case "RON":
                    return currency.rateRON;
                case "TRY":
                    return currency.rateTRY;
                case "RUB":
                    return currency.rateRUB;
            }
        })[0];
    }

    return (
        <CurrencyContext.Provider value={{currency, setCurrency, handleRate, currencies}}>{children}</CurrencyContext.Provider>
    );
};

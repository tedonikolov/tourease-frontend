
export default function CustomToastContent ({content}){
    return (
        <div className={`d-flex flex-column justify-content-center w-100 `}>
            {content.map((element, index) => (
                <p className={`mb-0`} key={index}>
                    {element}
                </p>
            ))}
        </div>
    );
};
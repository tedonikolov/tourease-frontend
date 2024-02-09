export default function CustomStepWizardNav({
                                                goToStep,
                                                currentStep,
                                                steps,
                                                setState,
                                                customContainerClass = '',
                                                isDisabled = false,
                                                hideNextSteps = false,
                                            }) {
    return (
        <div className={`d-flex border-bottom justify-content-center mb-3 p-3 px-1 w-100 ${customContainerClass}`}>
            <div className='d-flex w-100 justify-content-between'>
                {steps.map((step, i) => (
                    <div
                        key={i}
                        role='button'
                        className={`d-flex justify-content-center  w-50 step-nav-link ${isDisabled ? 'hover-none' : ''} text-center ${
                            currentStep === i + 1 ? 'text-success' : ''} 
                            ${hideNextSteps && i + 1 > currentStep ? 'text-white' : ''}
                            `}
                        onClick={!isDisabled ? () => {
                            setState && setState(step);
                            goToStep(i + 1);
                        } : () => {
                        }}
                    >
                        {i + 1 < currentStep && <i className="bi bi-check-circle-fill text-success"/>}
                        <h5>{step}</h5>
                    </div>
                ))}
            </div>
        </div>
    );
};
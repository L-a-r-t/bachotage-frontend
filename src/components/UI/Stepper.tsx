export default function Stepper({
  steps,
  currentStep,
  toStep,
  className,
}: StepperProps) {
  return (
    <div className={`w-full flex my-4 ${className}`}>
      {new Array(steps - 2).fill(null).map((el, idx) => (
        <div
          key={`step${idx}`}
          className={`relative h-1.5 w-full ${
            idx < currentStep ? "bg-main-100" : "bg-gray-400"
          }`}
        >
          <div
            onClick={() => toStep(idx)}
            className={`absolute -top-3 -left-2 w-8 h-8 border-4 border-spacing-4 rounded-full bg-white ${
              idx <= currentStep ? "border-main-100" : "border-gray-400"
            } cursor-pointer flex justify-center items-center`}
          >
            {idx + 1}
          </div>
        </div>
      ))}
      <div
        className={`relative h-1.5 w-full ${
          currentStep >= steps - 1 ? "bg-main-100" : "bg-gray-400"
        }`}
      >
        <div
          onClick={() => toStep(steps - 2)}
          className={`absolute -top-3 -left-2 w-8 h-8 border-4 rounded-full bg-white ${
            currentStep >= steps - 2 ? "border-main-100" : "border-gray-400"
          } cursor-pointer flex justify-center items-center`}
        >
          {steps - 1}
        </div>
        <div
          onClick={() => toStep(steps - 1)}
          className={`absolute -top-3 -right-2 w-8 h-8 border-4 rounded-full bg-white ${
            currentStep >= steps - 1 ? "border-main-100" : "border-gray-400"
          } cursor-pointer flex justify-center items-center`}
        >
          {steps}
        </div>
      </div>
    </div>
  )
}

type StepperProps = {
  steps: number
  currentStep: number
  toStep: (index: number) => void
  nextStep: () => void
  className?: string
}

export function NavButtons({
  steps,
  currentStep,
  toStep,
  nextStep,
  nextDisabled,
  className,
}: NavProps) {
  return (
    <div className={`flex justify-end gap-4 ${className}`}>
      {currentStep > 0 ? (
        <button
          className={` ${className}`}
          type="button"
          onClick={() => toStep(currentStep - 1)}
        >
          Previous
        </button>
      ) : (
        <div />
      )}
      <button
        type={currentStep >= steps - 1 ? "submit" : "button"}
        disabled={nextDisabled}
        onClick={nextStep}
      >
        {currentStep >= steps - 1 ? "Submit" : "Next"}
      </button>
    </div>
  )
}

type NavProps = StepperProps & {
  nextDisabled: boolean
}

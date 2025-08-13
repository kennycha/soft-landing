import { useState } from 'react';
import type { LandingPageConfig } from '@/lib/toml';

interface HowItWorksSectionProps {
  config: NonNullable<LandingPageConfig['howItWorks']>;
}

export function HowItWorksSection({ config }: HowItWorksSectionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = config.steps ?? [];
  const totalSteps = steps.length;

  return (
    <section className="px-6 py-12 lg:py-20">
      <div className="mx-auto max-w-4xl text-center">
        {config.title && (
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-5xl">{config.title}</h2>
        )}
        {config.description && (
          <p className="mx-auto max-w-2xl text-xl text-gray-600 lg:text-2xl">
            {config.description}
          </p>
        )}

        <div className="mt-16">
          <div className="mx-auto w-full max-w-2xl rounded-2xl border bg-white shadow-lg">
            {/* Step Indicators */}
            <div className="flex w-full items-center p-8">
              {steps.map((_, index) => {
                const stepNumber = index + 1;
                const isNotLastStep = index < totalSteps - 1;
                return (
                  <div key={stepNumber} className="flex flex-1 items-center">
                    <StepIndicator
                      step={stepNumber}
                      currentStep={currentStep}
                      onClickStep={setCurrentStep}
                    />
                    {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="px-8 pb-8">
              <div className="min-h-[80px] space-y-4">
                {steps[currentStep - 1] && (
                  <p className="text-md text-left leading-relaxed text-gray-600 lg:text-lg">
                    {steps[currentStep - 1].description}
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    currentStep === 1
                      ? 'cursor-not-allowed text-gray-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  disabled={currentStep === 1}
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                  className={`rounded-full px-6 py-2 font-medium text-white transition-colors ${
                    currentStep === totalSteps
                      ? 'bg-gray-800 hover:bg-gray-900'
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                >
                  {currentStep === totalSteps ? 'Complete' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
}: {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
}) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    onClickStep(step);
  };

  return (
    <div onClick={handleClick} className="relative outline-none focus:outline-none">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
          status === 'inactive'
            ? 'bg-gray-200 text-gray-500'
            : status === 'active'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-800 text-white'
        }`}
      >
        {status === 'complete' ? (
          <CheckIcon className="h-5 w-5 text-white" />
        ) : status === 'active' ? (
          <div className="h-3 w-3 rounded-full bg-white" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </div>
    </div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative mx-4 h-0.5 flex-1 overflow-hidden rounded bg-gray-200">
      <div
        className={`h-full transition-all duration-500 ${
          isComplete ? 'w-full bg-gray-800' : 'w-0 bg-transparent'
        }`}
      />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

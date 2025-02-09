import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
const PaymentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    cardNumber: "",
    cardExpiration: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your payment submission logic here
    console.log("Form Submitted:", formData);
    };
    
    const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State for controlling overlay visibility
        
            const handleOverlayDisplay = () => {
                setIsOverlayVisible(!isOverlayVisible);  // Toggle overlay visibility
            };

    return (
       <div
            id="contantUS"
            className={`fixed top-0 left-0 right-0 ${isOverlayVisible ? '' : 'hidden'} h-screen w-full z-50 bg-[rgba(0,0,0,0.45)]`}
            role="dialog"
                aria-modal="true"
                
        >
            <div className="flex justify-center items-center py-40 px-28">
        <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <div className="absolute top-16 right-56">
                        <IoIosCloseCircle
                            className="text-3xl text-gray-900 cursor-pointer"
                            onClick={handleOverlayDisplay}
                        />
            </div>        
    <div className="mx-auto max-w-screen-xl px-4 2xl:px-0  ">
                        
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl">Payment</h2>

          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
            <form
              onSubmit={handleSubmit}
              className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8"
            >
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full name (as displayed on card)*
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Bonnie Green"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="cardNumber"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Card number*
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    pattern="^4[0-9]{12}(?:[0-9]{3})?$"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardExpiration"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Card expiration*
                  </label>
                  <input
                    type="text"
                    id="cardExpiration"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="12/23"
                    value={formData.cardExpiration}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    CVV*
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="•••"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Pay now
              </button>
            </form>

            {/* Summary Section */}
            <div className="mt-6 grow sm:mt-8 lg:mt-0">
              <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Original price
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $6,592.00
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Savings
                    </dt>
                    <dd className="text-base font-medium text-green-500">
                      -$299.00
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Store Pickup
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $99
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Tax
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $799
                    </dd>
                  </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">$7,191.00</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
            </section>
            </div>
    
            </div>
  );
};

export default PaymentForm;

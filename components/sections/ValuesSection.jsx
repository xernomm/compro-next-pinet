import React from 'react';
import { getImageUrl } from '../../utils/imageUtils';

const ValuesSection = ({ values }) => {
    const activeValues = values.filter(value => value.is_active);

    if (activeValues.length === 0) return null;

    return (
        <section id="values" className="section-container bg-gray-50 dark:bg-dark-900 py-12 md:py-20">
            <h2 className="section-title mb-2">Our Values</h2>
            <p className="section-subtitle mb-8 md:mb-12">
                The principles that guide everything we do
            </p>

            {/* Container: Flex Row, No Scroll, Fit All */}
            <div className="w-full px-4 md:px-8">
                <div className="flex flex-row gap-2 md:gap-6 w-full">
                    {activeValues.map((value, index) => (
                        <div
                            key={value.id}
                            /* Flex-1 forces equal width sharing. min-w-0 allows shrinking below content size if needed (handling text wrap). */
                            className="flex-1 min-w-0 card card-hover-red p-3 md:p-6 text-center group transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center"
                            style={{
                                animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`,
                            }}
                        >
                            {/* Icon or Image */}
                            <div className="mb-3 md:mb-6 flex justify-center w-full">
                                {value.image_url ? (
                                    <div className="w-10 h-10 md:w-24 md:h-24 rounded-full overflow-hidden border-2 md:border-4 border-primary-100 dark:border-primary-900 shadow-inner group-hover:border-primary-500 transition-colors duration-300 shrink-0">
                                        <img
                                            src={getImageUrl(value.image_url)}
                                            alt={value.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                ) : value.icon ? (
                                    <div className="w-10 h-10 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary-500/30 shrink-0">
                                        <i className={`${value.icon} text-lg md:text-4xl text-white drop-shadow-md`} />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 flex items-center justify-center text-white text-lg md:text-3xl font-bold transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary-500/30 shrink-0">
                                        {value.title.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <h3 className="text-xs md:text-xl font-bold mb-2 md:mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors break-words w-full line-clamp-2">
                                {value.title}
                            </h3>
                            {value.description && (
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[10px] md:text-sm line-clamp-3 md:line-clamp-5 w-full">
                                    {value.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;

// 'use client';

// import { useState } from 'react';
// import CareerAdviceForm from './CareerAdviceForm';
// import FeatureHero from '../../shared/FeatureHero';
// import { Loader2 } from 'lucide-react';

// export default function CareerAdviceResult() {
//   const [loading, setLoading] = useState(false);
//   const [responseData, setResponseData] = useState(null);
//   const [error, setError] = useState(null);
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     setError(null);
//     setResponseData(null);

//     try {
//         const response = await fetch('https://prajjwal1729-chatbot-api.hf.space/career/generate_career_advice/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || 'Something went wrong');

//       setResponseData(result.career_guidance); // Adjusted to match API format
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       <FeatureHero
//         bg_url={
//           'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741329876/MacBook_Pro_16__-_1_3_rdftkl.svg'
//         }
//         title={'Career Advice Form'}
//       />
//       <div className="w-full mx-auto p-6 space-y-6 flex flex-col items-center">
//         {/* Career Advice Form */}
//         <CareerAdviceForm onSubmit={handleSubmit} />

//         {/* Loading & Error Handling */}
//         {loading && (
//   <div className="flex items-center justify-center mt-4 text-white space-x-2">
//     <Loader2 className="animate-spin w-6 h-6" />
//     <p>Generating Career Plan...</p>
//   </div>
// )}
//         {error && <p className="text-center mt-4 text-red-500">❌ {error}</p>}

//         {responseData && (
//           <div className="space-y-6 w-full">
//             {/* Display Career Paths */}
//             {responseData.map((advice, index) => (
//               <div key={index} className="p-6 bg-apts-lightdark text-white rounded-lg shadow-md mb-6">
//                 <h3 className="text-2xl font-semibold text-lavender-400">{advice.career_path}</h3>
//                 <p className="mt-2 text-lavender-100">{advice.why_fits}</p>

//                 <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                   {advice.roadmap.map((step, i) => (
//                     <div
//                       key={i}
//                       className=" relative glass-dark animate-fade-in rounded-lg shadow border border-lavender/60"
//                     >
//                       <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
//                           <div className='glass rounded-lg p-8 md:p-12 overflow-hidden h-full'>
//                       <h4 className="font-semibold text-lg text-lavender-200">{step.title}</h4>
//                       <p className="mt-2">{step.description}</p>
//                     </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useRef } from 'react';
import CareerAdviceForm from './CareerAdviceForm';
import FeatureHero from '../../shared/FeatureHero';
import { Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function CareerAdviceResult() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const resultRef = useRef();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const response = await fetch('https://prajjwal1729-chatbot-api.hf.space/career/generate_career_advice/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');

      setResponseData(result.career_guidance); // Adjusted to match API format
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
  const element = resultRef.current;
  if (!element) return;

  const cloned = element.cloneNode(true);
  cloned.style.background = '#fff';
  cloned.style.color = '#000';
  cloned.style.padding = '20px';
  cloned.style.width = '800px'; // A4 width in px at 96 DPI
  cloned.style.boxSizing = 'border-box';

  cloned.querySelectorAll('*').forEach((el) => {
    el.style.background = 'transparent';
    el.style.color = '#000';
    el.style.boxShadow = 'none';
    el.style.border = 'none';
    el.style.overflow = 'visible';
    el.style.fontSize = '12px';
    el.style.lineHeight = '1.4';
  });

  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'fixed';
  hiddenContainer.style.top = '-10000px';
  hiddenContainer.style.left = '-10000px';
  hiddenContainer.style.width = '800px';
  hiddenContainer.appendChild(cloned);
  document.body.appendChild(hiddenContainer);

  const canvas = await html2canvas(cloned, {
    scale: 2,
    backgroundColor: '#fff',
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let position = 0;

  // Split into pages if taller than 1 page
  if (imgHeight < pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  } else {
    while (position < imgHeight) {
      pdf.addImage(
        imgData,
        'PNG',
        0,
        -position,
        imgWidth,
        imgHeight
      );
      position += pageHeight;
      if (position < imgHeight) pdf.addPage();
    }
  }

  pdf.save('Career_Advice.pdf');
  document.body.removeChild(hiddenContainer);
};


  return (
    <div className="w-full">
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741329876/MacBook_Pro_16__-_1_3_rdftkl.svg'
        }
        title={'Career Advice Form'}
      />
      {/*  */}
      <div
    className="min-h-screen bg-repeat bg-left-top"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
    <div className="min-h-screen bg-black/60"> 
    <div className="w-full mx-auto p-6 space-y-6 flex flex-col border border-none items-center">
        
        {/* Career Advice Form */}
        <CareerAdviceForm onSubmit={handleSubmit} />

        {/* Loading & Error Handling */}
        {loading && (
          <div className="flex items-center justify-center mt-4 text-white space-x-2">
            <Loader2 className="animate-spin w-6 h-6" />
            <p>Generating Career Plan...</p>
          </div>
        )}
        {error && <p className="text-center mt-4 text-red-500">❌ {error}</p>}

        {responseData && (
          <>
            <div ref={resultRef} className="space-y-6 w-full">
              {/* Display Career Paths */}
              {responseData.map((advice, index) => (
                <div key={index} className="p-6 bg-transparent backdrop-blur-sm text-white rounded-lg shadow-md mb-6">
                  <h3 className="text-2xl font-semibold text-lavender-400">{advice.career_path}</h3>
                  <p className="mt-2 text-lavender-100">{advice.why_fits}</p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {advice.roadmap.map((step, i) => (
                      <div
                        key={i}
                        className="relative glass-dark animate-fade-in rounded-lg shadow border border-lavender/60"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
                        <div className="glass rounded-lg p-8 md:p-12 overflow-hidden h-full">
                          <h4 className="font-semibold text-lg text-lavender-200">{step.title}</h4>
                          <p className="mt-2">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="mt-6 bg-apts-purple-dark text-white hover:bg-apts-purple  shadow-md px-5 py-2 rounded transition"
            >
              📄 Download as PDF
            </button>
          </>
        )}
      </div>
      </div>
    </div>
    </div>
  );
}

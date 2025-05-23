import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const handleDownload = async (ref) => {
  if (!ref?.current) {
    console.error("Reference not found for PDF generation.");
    return;
  }

  const element = ref.current;

  // Clone and style for consistent rendering
  const cloned = element.cloneNode(true);
  cloned.style.background = '#fff';
  cloned.style.color = '#000';
  cloned.style.width = '794px';
  cloned.style.padding = '20px';
  cloned.style.boxSizing = 'border-box';
  cloned.style.overflowWrap = 'break-word';
  cloned.style.wordBreak = 'break-word';

  cloned.querySelectorAll('*').forEach((el) => {
    el.style.background = 'transparent';
    el.style.color = '#000';
    el.style.boxShadow = 'none';
    el.style.border = 'none';
    el.style.maxWidth = '100%';
    el.style.overflowWrap = 'break-word';
    el.style.wordBreak = 'break-word';
  });

  // Render off-screen
  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'fixed';
  hiddenContainer.style.top = '-10000px';
  hiddenContainer.style.left = '-10000px';
  hiddenContainer.style.width = '794px';
  hiddenContainer.appendChild(cloned);
  document.body.appendChild(hiddenContainer);

  try {
    const canvas = await html2canvas(cloned, {
      scale: 2,
      backgroundColor: '#fff',
      useCORS: true,
    });

    const imgHeight = canvas.height;
    const imgWidth = canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ratio = pageWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    let position = 0;

    // If content fits in one page
    if (scaledHeight <= pageHeight) {
      pdf.addImage(canvas, 'PNG', 0, 0, pageWidth, scaledHeight);
    } else {
      // Handle multi-page content
      let canvasOffset = 0;
      const pageCanvas = document.createElement('canvas');
      const context = pageCanvas.getContext('2d');

      const scaledCanvasHeightPerPage = Math.floor(pageHeight / ratio);
      while (canvasOffset < imgHeight) {
        pageCanvas.width = imgWidth;
        pageCanvas.height = scaledCanvasHeightPerPage;

        context.clearRect(0, 0, imgWidth, scaledCanvasHeightPerPage);
        context.drawImage(
          canvas,
          0,
          canvasOffset,
          imgWidth,
          scaledCanvasHeightPerPage,
          0,
          0,
          imgWidth,
          scaledCanvasHeightPerPage
        );

        const imgData = pageCanvas.toDataURL('image/png');
        if (canvasOffset === 0) {
          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        } else {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        }

        canvasOffset += scaledCanvasHeightPerPage;
      }
    }

    pdf.save('Injury_Recovery_Plan.pdf');
  } catch (err) {
    console.error('PDF generation failed:', err);
  } finally {
    document.body.removeChild(hiddenContainer);
  }
};

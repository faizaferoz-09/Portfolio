/**
 * ============================================================================
 * Velora POS - Sales Point & Receipt Generator Script
 * Author: DeepMind Antigravity Pair Programmer
 * Tech Stack: JavaScript (ES6+), jQuery 3.7+, jQuery Validation, jsPDF, html2canvas
 * ============================================================================
 */

$(document).ready(function () {
    // ------------------------------------------------------------------------
    // 1. GLOBAL STATE & CONSTANTS
    // ------------------------------------------------------------------------
    let itemCounter = 0;           // Unique counter for input field names & dynamic IDs
    const TAX_RATE = 0.05;         // Standard 5% estimated tax / GST rate

    // ------------------------------------------------------------------------
    // 2. LIVE CLOCK INITIALIZATION
    // ------------------------------------------------------------------------
    /**
     * Updates the header clock display every second
     */
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        $('#clock-display').text(timeString);
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ------------------------------------------------------------------------
    // 3. DYNAMIC PRODUCT ROW MANAGEMENT
    // ------------------------------------------------------------------------
    /**
     * Adds a new item row to the product entry table
     * @param {string} name - Optional product name default
     * @param {number} qty - Optional quantity default
     * @param {number} price - Optional unit price default
     * @param {number} discount - Optional item discount default
     */
    function addProductRow(name = '', qty = 1, price = 0, discount = 0) {
        itemCounter++;
        const rowId = `item-row-${itemCounter}`;

        const rowHtml = `
            <tr id="${rowId}" class="product-item-row">
                <td>
                    <input type="text" 
                           name="product_name_${itemCounter}" 
                           class="form-control item-name" 
                           placeholder="Item description" 
                           value="${name}" 
                           required>
                </td>
                <td>
                    <input type="number" 
                           name="product_qty_${itemCounter}" 
                           class="form-control item-qty" 
                           min="1" 
                           step="1" 
                           value="${qty}" 
                           required>
                </td>
                <td>
                    <input type="number" 
                           name="product_price_${itemCounter}" 
                           class="form-control item-price" 
                           min="0.01" 
                           step="0.01" 
                           placeholder="0.00" 
                           value="${price > 0 ? price : ''}" 
                           required>
                </td>
                <td>
                    <input type="number" 
                           name="product_discount_${itemCounter}" 
                           class="form-control item-discount" 
                           min="0" 
                           step="0.01" 
                           placeholder="0.00" 
                           value="${discount > 0 ? discount : ''}">
                </td>
                <td style="text-align: center;">
                    <button type="button" class="btn-remove-row" title="Remove line item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;

        $('#items-table-body').append(rowHtml);

        // Add dynamic jQuery validation rules to newly added row inputs
        $(`input[name="product_name_${itemCounter}"]`).rules('add', {
            required: true,
            messages: { required: "Name required" }
        });
        $(`input[name="product_qty_${itemCounter}"]`).rules('add', {
            required: true,
            min: 1,
            messages: { required: "Qty", min: "Min 1" }
        });
        $(`input[name="product_price_${itemCounter}"]`).rules('add', {
            required: true,
            min: 0.01,
            messages: { required: "Price", min: "> 0" }
        });

        // Trigger live calculation update
        calculateTotals();
    }

    // Event listener: Add Item button click
    $('#btn-add-item').on('click', function () {
        addProductRow();
    });

    // Event listener: Remove Item row click (delegated listener)
    $('#items-table-body').on('click', '.btn-remove-row', function () {
        // Prevent deleting the last remaining row to keep form functional
        if ($('.product-item-row').length > 1) {
            $(this).closest('tr').remove();
            calculateTotals();
        } else {
            alert("A sale must contain at least one product item.");
        }
    });

    // ------------------------------------------------------------------------
    // 4. AUTOMATIC MATHEMATICAL CALCULATIONS (JAVASCRIPT)
    // ------------------------------------------------------------------------
    /**
     * Iterates through all product rows, computes line totals, subtotal, discount,
     * tax, grand total, and change due. Updates UI summaries automatically.
     */
    function calculateTotals() {
        let subtotal = 0;
        let totalDiscount = 0;

        $('.product-item-row').each(function () {
            const qty = parseFloat($(this).find('.item-qty').val()) || 0;
            const price = parseFloat($(this).find('.item-price').val()) || 0;
            const discount = parseFloat($(this).find('.item-discount').val()) || 0;

            const lineGross = qty * price;
            subtotal += lineGross;
            totalDiscount += discount;
        });

        // Ensure discount does not exceed subtotal
        if (totalDiscount > subtotal) {
            totalDiscount = subtotal;
        }

        const netSubtotal = subtotal - totalDiscount;
        const taxAmount = netSubtotal * TAX_RATE;
        const grandTotal = netSubtotal + taxAmount;

        // Calculate change due based on amount paid input
        const amountPaid = parseFloat($('#amountPaid').val()) || 0;
        let changeDue = 0;
        if (amountPaid >= grandTotal && grandTotal > 0) {
            changeDue = amountPaid - grandTotal;
        }

        // Update DOM elements on POS form summary card
        $('#calc-subtotal').text(`$${subtotal.toFixed(2)}`);
        $('#calc-discount').text(`-$${totalDiscount.toFixed(2)}`);
        $('#calc-grand-total').text(`$${grandTotal.toFixed(2)}`);
        $('#calc-change-due').text(`$${changeDue.toFixed(2)}`);

        // Return structured calculations for receipt generator
        return {
            subtotal: subtotal,
            discount: totalDiscount,
            tax: taxAmount,
            grandTotal: grandTotal,
            amountPaid: amountPaid,
            changeDue: changeDue
        };
    }

    // Bind real-time input event for live calculations
    $('#pos-sales-form').on('input change', '.item-qty, .item-price, .item-discount, #amountPaid', function () {
        calculateTotals();
    });

    // ------------------------------------------------------------------------
    // 5. JQUERY VALIDATION PLUGIN INTEGRATION
    // ------------------------------------------------------------------------
    /**
     * Custom validation rule: Phone Number format validation
     */
    $.validator.addMethod("phoneFormat", function (value, element) {
        return this.optional(element) || /^[0-9\-\+\s\(\)]{7,20}$/.test(value);
    }, "Please enter a valid phone number");

    // Initialize form validation
    const validator = $('#pos-sales-form').validate({
        errorClass: "error",
        errorElement: "label",
        rules: {
            customerName: {
                required: true,
                minlength: 2
            },
            customerPhone: {
                required: true,
                phoneFormat: true
            },
            cashierName: {
                required: true,
                minlength: 2
            },
            paymentMethod: {
                required: true
            },
            amountPaid: {
                required: true,
                min: 0
            }
        },
        messages: {
            customerName: "Please enter customer name",
            customerPhone: "Valid phone number required",
            cashierName: "Cashier name required",
            amountPaid: "Enter amount paid"
        },
        highlight: function (element) {
            $(element).addClass('error');
        },
        unhighlight: function (element) {
            $(element).removeClass('error');
        },
        // Triggered only when form validation passes
        submitHandler: function (form) {
            const totals = calculateTotals();
            
            // Optional warning if amount paid is less than grand total
            if (totals.amountPaid < totals.grandTotal) {
                if (!confirm(`Amount Paid ($${totals.amountPaid.toFixed(2)}) is less than Grand Total ($${totals.grandTotal.toFixed(2)}). Continue generating receipt?`)) {
                    return false;
                }
            }

            generateReceipt(totals);
            return false; // Prevent traditional form POST page refresh
        }
    });

    // ------------------------------------------------------------------------
    // 6. THERMAL POS RECEIPT GENERATION LOGIC
    // ------------------------------------------------------------------------
    /**
     * Populates and renders the 80mm thermal receipt with form data
     * @param {Object} totals - Calculated financial totals
     */
    function generateReceipt(totals) {
        const now = new Date();
        
        // 1. Generate Unique Receipt Number: VEL-YYYYMMDD-XXXX
        const dateFormatted = now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0');
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        const receiptNo = `VEL-${dateFormatted}-${randomCode}`;

        // 2. Format Timestamp
        const timeFormatted = now.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // 3. Extract Customer & Cashier Info
        const customerName = $('#customerName').val().trim();
        const customerPhone = $('#customerPhone').val().trim();
        const cashierName = $('#cashierName').val().trim();
        const paymentMethod = $('#paymentMethod').val();

        // 4. Update Receipt Header Metadata
        $('#rec-number').text(receiptNo);
        $('#rec-datetime').text(timeFormatted);
        $('#rec-cashier').text(cashierName);
        $('#rec-customer').text(customerName);
        $('#rec-phone').text(customerPhone);

        // 5. Render Product Items in Receipt Table
        const $receiptItemsList = $('#rec-items-list');
        $receiptItemsList.empty();

        $('.product-item-row').each(function () {
            const name = $(this).find('.item-name').val().trim();
            const qty = parseFloat($(this).find('.item-qty').val()) || 0;
            const price = parseFloat($(this).find('.item-price').val()) || 0;
            const discount = parseFloat($(this).find('.item-discount').val()) || 0;

            const lineTotal = (qty * price) - discount;

            let discountSubtitle = '';
            if (discount > 0) {
                discountSubtitle = `<span class="receipt-item-sub">Disc: -$${discount.toFixed(2)}</span>`;
            }

            const itemHtml = `
                <tr>
                    <td class="col-item">
                        <span class="receipt-item-name">${escapeHtml(name)}</span>
                        ${discountSubtitle}
                    </td>
                    <td class="col-qty">${qty}</td>
                    <td class="col-price">$${price.toFixed(2)}</td>
                    <td class="col-total">$${lineTotal.toFixed(2)}</td>
                </tr>
            `;

            $receiptItemsList.append(itemHtml);
        });

        // 6. Update Receipt Totals Section
        $('#rec-subtotal').text(`$${totals.subtotal.toFixed(2)}`);
        $('#rec-discount').text(`-$${totals.discount.toFixed(2)}`);
        $('#rec-tax').text(`$${totals.tax.toFixed(2)}`);
        $('#rec-grand-total').text(`$${totals.grandTotal.toFixed(2)}`);
        $('#rec-pay-method').text(paymentMethod.toUpperCase());
        $('#rec-paid').text(`$${totals.amountPaid.toFixed(2)}`);
        $('#rec-change').text(`$${totals.changeDue.toFixed(2)}`);

        // 7. Render Authentic Barcode using JsBarcode
        try {
            JsBarcode("#barcode-canvas", receiptNo, {
                format: "CODE128",
                width: 1.6,
                height: 40,
                displayValue: false,
                margin: 0,
                lineColor: "#000000"
            });
            $('#rec-barcode-id').text(receiptNo);
        } catch (e) {
            console.error("Barcode generation error:", e);
        }

        // 8. Enable Action Buttons & Update Status Badge
        $('#btn-print, #btn-pdf').prop('disabled', false);
        $('#status-badge').text('Generated').removeClass('badge-success').addClass('badge-primary');

        // Smooth scroll to receipt preview on mobile screens
        if ($(window).width() < 1024) {
            $('html, body').animate({
                scrollTop: $('.receipt-section').offset().top - 20
            }, 500);
        }
    }

    // ------------------------------------------------------------------------
    // 7. PRINT RECEIPT FUNCTIONALITY
    // ------------------------------------------------------------------------
    $('#btn-print').on('click', function () {
        if ($(this).is(':disabled')) return;
        // Triggers standard print dialog; CSS @media print isolates #thermal-receipt
        window.print();
    });

    // ------------------------------------------------------------------------
    // 8. PDF DOWNLOAD FUNCTIONALITY (jsPDF + html2canvas)
    // ------------------------------------------------------------------------
    /**
     * Captures ONLY the #thermal-receipt container and converts it into a narrow PDF
     */
    $('#btn-pdf').on('click', function () {
        if ($(this).is(':disabled')) return;

        const $pdfBtn = $(this);
        const originalBtnHtml = $pdfBtn.html();

        // Show loading spinner status
        $pdfBtn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...');

        const receiptElement = document.getElementById('thermal-receipt');

        // Configure html2canvas for crisp vector quality rasterization
        html2canvas(receiptElement, {
            scale: 3, // High DPI scale factor for crisp typography
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        }).then(function (canvas) {
            // Obtain jsPDF instance from window.jspdf UMD scope
            const { jsPDF } = window.jspdf;

            // Dimensions of 80mm thermal paper
            const pdfWidthMm = 80; // Standard POS receipt width
            
            // Calculate proportional height based on canvas aspect ratio
            const imgWidthPx = canvas.width;
            const imgHeightPx = canvas.height;
            const pdfHeightMm = (imgHeightPx * pdfWidthMm) / imgWidthPx;

            // Initialize custom sized single-page jsPDF document matching receipt height
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [pdfWidthMm, pdfHeightMm + 4] // Extra 4mm padding
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            pdf.addImage(imgData, 'PNG', 0, 2, pdfWidthMm, pdfHeightMm);

            // Generate filename based on receipt number
            const receiptNo = $('#rec-number').text() || 'VEL-Receipt';
            pdf.save(`${receiptNo}.pdf`);

            // Restore button state
            $pdfBtn.prop('disabled', false).html(originalBtnHtml);
        }).catch(function (error) {
            console.error("PDF Export failed:", error);
            alert("Could not generate PDF. Please try again.");
            $pdfBtn.prop('disabled', false).html(originalBtnHtml);
        });
    });

    // ------------------------------------------------------------------------
    // 9. DEMO DATA QUICK FILL (FOR ACADEMIC PRESENTATIONS)
    // ------------------------------------------------------------------------
    $('#btn-demo').on('click', function () {
        // Clear existing product rows
        $('#items-table-body').empty();
        itemCounter = 0;

        // Fill customer and transaction fields
        $('#customerName').val('Sophia Martinez');
        $('#customerPhone').val('+1 (555) 839-2041');
        $('#cashierName').val('Alex Morgan');
        $('#paymentMethod').val('Cash');
        $('#amountPaid').val('150.00');

        // Add 3 sample items
        addProductRow('Wireless Ergonomic Mouse', 1, 45.00, 5.00);
        addProductRow('USB-C Fast Charging Cable (2m)', 2, 18.50, 2.00);
        addProductRow('Mechanical Keycap Set (Retro)', 1, 55.00, 0.00);

        // Clear previous validation error highlights
        validator.resetForm();
        $('.form-control').removeClass('error');

        // Trigger automatic calculation and generate receipt immediately
        const totals = calculateTotals();
        generateReceipt(totals);
    });

    // ------------------------------------------------------------------------
    // 10. RESET FORM FUNCTIONALITY
    // ------------------------------------------------------------------------
    $('#btn-reset-all').on('click', function () {
        if (confirm("Reset form and clear receipt preview?")) {
            $('#pos-sales-form')[0].reset();
            $('#items-table-body').empty();
            itemCounter = 0;
            
            // Add single clean default item row
            addProductRow();

            // Reset summary calculations
            calculateTotals();

            // Reset receipt placeholder view
            $('#rec-items-list').html(`
                <tr class="empty-placeholder">
                    <td colspan="4" style="text-align: center; padding: 25px 0; color: #888;">
                        <em>Fill out the form & click "Generate Receipt" to render POS invoice...</em>
                    </td>
                </tr>
            `);

            $('#rec-number').text('VEL-20260906-0000');
            $('#rec-datetime').text('--/--/---- --:--:--');
            $('#rec-cashier').text('--');
            $('#rec-customer').text('--');
            $('#rec-phone').text('--');
            $('#rec-subtotal').text('$0.00');
            $('#rec-discount').text('-$0.00');
            $('#rec-tax').text('$0.00');
            $('#rec-grand-total').text('$0.00');
            $('#rec-paid').text('$0.00');
            $('#rec-change').text('$0.00');

            // Clear barcode
            const svg = document.getElementById('barcode-canvas');
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            $('#rec-barcode-id').text('VEL-20260906-0000');

            // Disable buttons
            $('#btn-print, #btn-pdf').prop('disabled', true);
            $('#status-badge').text('Live Ready').removeClass('badge-primary').addClass('badge-success');

            validator.resetForm();
            $('.form-control').removeClass('error');
        }
    });

    // Helper function to sanitize user inputs for HTML rendering
    function escapeHtml(text) {
        return $('<div>').text(text).html();
    }

    // Initial setup: Populate initial product row on load
    addProductRow('Wireless Keyboard', 1, 29.99, 3.00);
    $('#amountPaid').val('30.00');
    calculateTotals();
});

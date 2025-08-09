import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export async function startScanner({
    elementId,
    onSuccess,
    onFinish,
}) {
    const scanner = new Html5Qrcode(elementId);

    return new Promise(async (resolve, reject) => {
        let timeoutId;

        const stopAndCleanUp = async () => {
            clearTimeout(timeoutId);
            await scanner.stop();
            scanner.clear();
            onFinish?.();
        };

        try {
            await scanner.start(
                {},
                {
                    fps: 15,
                    qrbox: { width: 250, height: 100 },
                    videoConstraints: {
                        advanced: [
                            { focusMode: "continuous" },
                            { zoom: 3 },
                            { facingMode: "environment" },
                        ],
                    },
                    aspectRatio: 15 / 16,
                },
                async (decodedText, decodedResult) => {
                    await stopAndCleanUp();

                    try {
                        validate(decodedResult);
                    } catch (error) {
                        reject(error);
                    }

                    onSuccess(decodedText);
                    resolve(scanner); // ✅ Resolve on success
                },
                () => {
                    // Optional error handler
                }
            );

            // ✅ Reject the promise on timeout
            timeoutId = setTimeout(async () => {
                await stopAndCleanUp();
                reject(new Error("Scanner timeout: No QR code detected within 15 seconds."));
            }, 15000);
        } catch (err) {
            await stopAndCleanUp();
            reject(err);
        }
    });
}

function validate(scanResult) {
    const validFormats = [
        Html5QrcodeSupportedFormats.PDF_417,
        // Html5QrcodeSupportedFormats.QR_CODE,
    ];

    if (!scanResult) {
        throw new Error("Invalid scan result: Scan result is null or undefined.");
    }
    if (!validFormats.find((x) => x == scanResult.result.format?.format)) {
        throw new Error(`Invalid scan result: Unsupported format ${scanResult.result.format}.`);
    }
}
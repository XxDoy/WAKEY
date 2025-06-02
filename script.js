document.addEventListener("DOMContentLoaded", function () {
	// Inisialisasi fullPage.js
	new fullpage("#fullpage", {
		scrollingSpeed: 1000,
		autoScrolling: true,
		fitToSection: true,
		fitToSectionDelay: 1000,
		navigation: true,
		navigationPosition: "right",
		navigationTooltips: ["Beranda", "Produk", "Lokasi", "Kontak"],
		showActiveTooltip: true, // Biarkan fullPage.js yang mengelola ini untuk teks statis
		anchors: ["beranda", "produk", "lokasi", "kontak"],
		licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
		verticalCentered: false, // PENTING: Biarkan CSS Flexbox yang menangani centering

		onLeave: function (origin, destination, direction) {
			const leavingSection = origin.item;
			const enteringSection = destination.item;

			// Animasi untuk elemen teks utama yang keluar
			let leavingTextElements = [];
			if (leavingSection.querySelector(".main-title"))
				leavingTextElements.push(leavingSection.querySelector(".main-title"));
			if (leavingSection.querySelector(".main-subtitle"))
				leavingTextElements.push(
					leavingSection.querySelector(".main-subtitle")
				);
			if (leavingSection.querySelector(".section-main-title"))
				leavingTextElements.push(
					leavingSection.querySelector(".section-main-title")
				);

			leavingTextElements.forEach((el) => {
				if (el)
					gsap.to(el, { opacity: 0, y: -60, duration: 0.6, ease: "power2.in" });
			});

			// Animasi untuk elemen teks utama yang masuk
			let enteringTextElements = [];
			if (enteringSection.querySelector(".main-title"))
				enteringTextElements.push(enteringSection.querySelector(".main-title"));
			if (enteringSection.querySelector(".main-subtitle"))
				enteringTextElements.push(
					enteringSection.querySelector(".main-subtitle")
				);
			if (enteringSection.querySelector(".section-main-title"))
				enteringTextElements.push(
					enteringSection.querySelector(".section-main-title")
				);

			enteringTextElements.forEach((el) => {
				if (el)
					gsap.fromTo(
						el,
						{ y: 60, opacity: 0 },
						{ y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
					);
			});

			// Animasi untuk Navigasi Checkpoint (Dot menjadi jelas saat transisi)
			const allDots = document.querySelectorAll("#fp-nav ul li a span");
			allDots.forEach((dot) => {
				gsap.to(dot, {
					filter: "blur(1px)",
					opacity: 0.6,
					scale: 1,
					duration: 0.3,
				}); // Reset semua dot ke blur
			});

			const destinationDot = document.querySelector(
				`#fp-nav ul li a[href="#${destination.anchor}"] span`
			);
			if (destinationDot) {
				// Buat dot tujuan menjadi jelas
				gsap.to(destinationDot, {
					filter: "blur(0px)",
					opacity: 1,
					scale: 1.2,
					duration: 0.2,
					ease: "power1.out",
					delay: 0.1,
				});
			}
		},
		afterLoad: function (origin, destination, direction) {
			// Memastikan elemen di section yang baru dimuat terlihat jelas
			const currentSection = destination.item;
			let currentTextElements = [];
			if (currentSection.querySelector(".main-title"))
				currentTextElements.push(currentSection.querySelector(".main-title"));
			if (currentSection.querySelector(".main-subtitle"))
				currentTextElements.push(
					currentSection.querySelector(".main-subtitle")
				);
			if (currentSection.querySelector(".section-main-title"))
				currentTextElements.push(
					currentSection.querySelector(".section-main-title")
				);

			currentTextElements.forEach((el) => {
				if (el) gsap.to(el, { opacity: 1, y: 0, duration: 0 });
			});

			// Mengatur tampilan dot dan tooltip setelah section dimuat
			const navItems = document.querySelectorAll("#fp-nav ul li");
			navItems.forEach((item) => {
				const tooltip = item.querySelector(".fp-tooltip");
				const dot = item.querySelector("a span");
				if (item.classList.contains("active")) {
					if (tooltip) {
						// Tampilkan tooltip (nama page)
						gsap.to(tooltip, {
							opacity: 1,
							x: 0,
							visibility: "visible",
							duration: 0.3,
							delay: 0.05,
							ease: "power2.out",
						});
					}
					if (dot) {
						// Sembunyikan dot
						gsap.to(dot, { opacity: 0, visibility: "hidden", duration: 0.15 });
					}
				} else {
					if (tooltip) {
						// Sembunyikan tooltip
						gsap.to(tooltip, {
							opacity: 0,
							x: 15,
							visibility: "hidden",
							duration: 0.3,
							ease: "power1.in",
						});
					}
					if (dot) {
						// Tampilkan dot (dengan blur)
						gsap.to(dot, {
							filter: "blur(1px)",
							opacity: 0.6,
							scale: 1,
							visibility: "visible",
							duration: 0.3,
						});
					}
				}
			});
		},
	});

	// --- Gemini API Integration ---
	const apiKey = "";

	async function callGeminiAPI(prompt, outputElement, loadingSpinner) {
		if (!prompt.trim()) {
			outputElement.textContent = "Harap masukkan prompt atau teks yang valid.";
			outputElement.style.display = "block";
			loadingSpinner.style.display = "none";
			return;
		}

		loadingSpinner.style.display = "inline-block";
		outputElement.style.display = "none";

		const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
		const payload = { contents: chatHistory };
		const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error("API Error:", errorData);
				throw new Error(
					`API request failed with status ${response.status}: ${
						errorData.error?.message || "Unknown error"
					}`
				);
			}

			const result = await response.json();

			if (
				result.candidates &&
				result.candidates.length > 0 &&
				result.candidates[0].content &&
				result.candidates[0].content.parts &&
				result.candidates[0].content.parts.length > 0
			) {
				const text = result.candidates[0].content.parts[0].text;
				outputElement.textContent = text;
				outputElement.style.display = "block";
			} else {
				console.error("Unexpected API response structure:", result);
				outputElement.textContent =
					"Gagal mendapatkan respons dari AI. Struktur respons tidak sesuai.";
				outputElement.style.display = "block";
			}
		} catch (error) {
			console.error("Error calling Gemini API:", error);
			outputElement.textContent = `Terjadi kesalahan: ${error.message}. Coba lagi nanti.`;
			outputElement.style.display = "block";
		} finally {
			loadingSpinner.style.display = "none";
		}
	}

	const poeticDescBtn = document.getElementById("generate-poetic-desc-btn");
	const poeticDescOutput = document.getElementById("poetic-description-output");
	const poeticDescSpinner = poeticDescBtn
		? poeticDescBtn.querySelector(".loading-spinner")
		: null;

	if (poeticDescBtn && poeticDescSpinner && poeticDescOutput) {
		poeticDescBtn.addEventListener("click", function () {
			const originalDescContainer = document.getElementById(
				"original-description-container"
			);
			let originalText = "";
			if (originalDescContainer) {
				originalDescContainer.querySelectorAll("p, li").forEach((el) => {
					originalText += el.textContent.trim() + "\n";
				});
			}

			if (!originalText.trim()) {
				poeticDescOutput.textContent = "Deskripsi produk asli tidak ditemukan.";
				poeticDescOutput.style.display = "block";
				return;
			}

			const prompt = `Anda adalah seorang penulis puisi kuliner handal. Ubahlah deskripsi produk berikut menjadi sebuah puisi yang indah, menggugah selera, dan elegan untuk snack bar bernama Wakey!:\n\n${originalText.trim()}`;
			callGeminiAPI(prompt, poeticDescOutput, poeticDescSpinner);
		});
	}

	const assistMessageBtn = document.getElementById("assist-message-btn");
	const contactMessageTextarea = document.getElementById("contact-message");
	const contactNameInput = document.getElementById("contact-name");
	const assistedMessageOutput = document.getElementById(
		"assisted-message-output"
	);
	const assistMessageSpinner = assistMessageBtn
		? assistMessageBtn.querySelector(".loading-spinner")
		: null;

	if (
		assistMessageBtn &&
		contactMessageTextarea &&
		assistMessageSpinner &&
		assistedMessageOutput
	) {
		assistMessageBtn.addEventListener("click", function () {
			const userName = contactNameInput ? contactNameInput.value.trim() : "";
			const userKeywords = contactMessageTextarea.value.trim();

			let prompt;
			if (userKeywords) {
				prompt = `Anda adalah asisten virtual yang sangat ramah dan membantu untuk brand snack bar "Wakey!". Seorang pengguna bernama "${
					userName || "Pengguna"
				}" ingin mengirim pesan dengan kata kunci atau topik: "${userKeywords}". \n\nBantu susun draf pesan yang sopan, jelas, dan profesional untuk mereka. Tawarkan untuk memasukkan detail lebih lanjut jika perlu. Mulai dengan sapaan yang sesuai.`;
			} else {
				prompt = `Anda adalah asisten virtual yang sangat ramah dan membantu untuk brand snack bar "Wakey!". Seorang pengguna bernama "${
					userName || "Pengguna"
				}" ingin mengirim pesan tetapi belum menulis apa pun. \n\nBantu susun draf pesan umum yang sopan untuk menanyakan tentang produk Wakey!, menyampaikan saran, atau menjajaki peluang kemitraan. Tawarkan beberapa opsi awal atau pertanyaan pembuka.`;
			}

			callGeminiAPI(prompt, assistedMessageOutput, assistMessageSpinner);
		});
	}
});

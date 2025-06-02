document.addEventListener("DOMContentLoaded", function () {
	const customNavDots = document.querySelectorAll("#custom-nav .nav-dot");
	let fullpageInstance = null;

	if (document.getElementById("fullpage") && customNavDots.length > 0) {
		fullpageInstance = new fullpage("#fullpage", {
			scrollingSpeed: 700, // Durasi scroll lebih cepat
			autoScrolling: true,
			fitToSection: true,
			fitToSectionDelay: 500, // Delay lebih cepat
			navigation: false,
			anchors: ["beranda", "produk", "lokasi", "kontak"],
			licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
			verticalCentered: false,

			onLeave: function (origin, destination, direction) {
				const leavingSection = origin.item;
				const enteringSection = destination.item;

				// Animasi teks konten utama keluar
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
						gsap.to(el, {
							opacity: 0,
							y: -50,
							duration: 0.4,
							ease: "power2.in",
						});
				});

				// Animasi teks konten utama masuk
				let enteringTextElements = [];
				if (enteringSection.querySelector(".main-title"))
					enteringTextElements.push(
						enteringSection.querySelector(".main-title")
					);
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
							{ y: 50, opacity: 0 },
							{
								y: 0,
								opacity: 1,
								duration: 0.6,
								ease: "power2.out",
								delay: 0.3,
							}
						);
				});

				// Update Navigasi Kustom - Transisi Keluar
				customNavDots.forEach((dot) => {
					const dotCircle = dot.querySelector(".dot-circle");
					const dotLabel = dot.querySelector(".dot-label");
					const menuAnchor = dot.getAttribute("data-menuanchor");

					if (menuAnchor === origin.anchor) {
						if (dotLabel)
							gsap.to(dotLabel, {
								opacity: 0,
								visibility: "hidden",
								x: 10,
								duration: 0.15,
								ease: "power1.in",
							});
						if (dotCircle)
							gsap.to(dotCircle, {
								opacity: 0.65,
								visibility: "visible",
								scale: 1,
								filter: "blur(1px)",
								duration: 0.2,
								ease: "power1.out",
								delay: 0.05,
							});
					}
				});

				// Untuk item tujuan, dotnya akan dibuat jelas sementara saat transisi
				const destinationCustomDotCircle = document.querySelector(
					`#custom-nav .nav-dot[data-menuanchor="${destination.anchor}"] .dot-circle`
				);
				if (destinationCustomDotCircle) {
					gsap.to(destinationCustomDotCircle, {
						filter: "blur(0px)",
						opacity: 1,
						scale: 1.2,
						duration: 0.15,
						ease: "power1.out",
						delay: 0.05,
					});
				}
			},
			afterLoad: function (origin, destination, direction) {
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

				// Update akhir Navigasi Kustom setelah section dimuat
				customNavDots.forEach((dotLink) => {
					const dotCircle = dotLink.querySelector(".dot-circle");
					const dotLabel = dotLink.querySelector(".dot-label");
					const menuAnchor = dotLink.getAttribute("data-menuanchor");

					if (menuAnchor === destination.anchor) {
						// Item aktif
						dotLink.classList.add("active");
						if (dotLabel)
							gsap.to(dotLabel, {
								opacity: 1,
								visibility: "visible",
								x: 0,
								duration: 0.2,
								delay: 0.05,
								ease: "power2.out",
							});
						if (dotCircle)
							gsap.to(dotCircle, {
								opacity: 0,
								visibility: "hidden",
								scale: 0.5,
								duration: 0.15,
								ease: "power1.in",
							});
					} else {
						// Item tidak aktif
						dotLink.classList.remove("active");
						if (dotLabel)
							gsap.to(dotLabel, {
								opacity: 0,
								visibility: "hidden",
								x: 10,
								duration: 0.2,
								ease: "power1.in",
							});
						if (dotCircle)
							gsap.to(dotCircle, {
								filter: "blur(1px)",
								opacity: 0.65,
								scale: 1,
								visibility: "visible",
								duration: 0.2,
								ease: "power1.out",
							});
					}
				});
			},
		});

		customNavDots.forEach((dot) => {
			dot.addEventListener("click", function (e) {
				e.preventDefault();
				const targetAnchor = this.getAttribute("data-menuanchor");
				if (typeof fullpage_api !== "undefined" && fullpage_api.moveTo) {
					fullpage_api.moveTo(targetAnchor);
				} else {
					console.error("fullPage API (fullpage_api.moveTo) not available.");
				}
			});
		});
	} else {
		console.warn(
			"Elemen #fullpage tidak ditemukan atau navigasi kustom tidak ada. fullPage.js tidak diinisialisasi dengan benar."
		);
	}

	// Tombol placeholder (pengganti Gemini)
	const poeticDescBtnPlaceholder = document.getElementById(
		"generate-poetic-desc-btn-placeholder"
	);
	if (poeticDescBtnPlaceholder) {
		poeticDescBtnPlaceholder.addEventListener("click", function () {
			alert("Fitur deskripsi puitis akan segera hadir!");
		});
	}

	const assistMessageBtnPlaceholder = document.getElementById(
		"assist-message-btn-placeholder"
	);
	if (assistMessageBtnPlaceholder) {
		assistMessageBtnPlaceholder.addEventListener("click", function () {
			alert("Fitur bantuan tulis pesan akan segera hadir!");
		});
	}
});

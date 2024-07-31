// 修改 a 連結標籤 target 屬性
function modifyLinkTargets() {
  const links = document.querySelectorAll("a");
  links.forEach((a) => {
    if (a.hasAttribute("target") && !a.hasAttribute("rel")) {
      a.setAttribute("rel", "noreferrer noopener");
    }
  });
}
// 評分星星
function renderStarRatings() {
  const starRatings = document.querySelectorAll(".star-rating");
  if (starRatings) {
    starRatings.forEach((starRating) => {
      const score = parseInt(starRating.getAttribute("data-score"), 10);
      let starsHTML = "";
      for (let i = 0; i < score; i++) {
        starsHTML += `
        <li class="star">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="#5f6368" viewBox="0 -960 960 960">
            <path d="m305-704 112-145q12-16 28.5-23.5T480-880q18 0 34.5 7.5T543-849l112 145 170 57q26 8 41 29.5t15 47.5q0 12-3.5 24T866-523L756-367l4 164q1 35-23 59t-56 24q-2 0-22-3l-179-50-179 50q-5 2-11 2.5t-11 .5q-32 0-56-24t-23-59l4-165L95-523q-8-11-11.5-23T80-570q0-25 14.5-46.5T135-647l170-57Z"/>
          </svg>
        </li>
        `;
        starRating.innerHTML = starsHTML;
      }
    });
  }
}
// 漢堡選單 toggle
function toggleMenu() {
  const collapse = document.querySelector(".collapse");
  const collapseToggle = document.querySelector(".collapse__toggle");
  if (collapse.classList.contains("show")) {
    hideMenu(collapse, collapseToggle);
  } else {
    showMenu(collapse, collapseToggle);
  }
}
// 顯示漢堡選單
function showMenu(collapse, collapseToggle) {
  collapseToggle.classList.add("collapsed");
  collapseToggle.setAttribute("aria-expanded", "true");
  collapseToggle.setAttribute("aria-label", "關閉選單");
  collapse.classList.add("show");
  document.body.style.overflow = "hidden";
}
// 隱藏漢堡選單
function hideMenu(collapse, collapseToggle) {
  collapseToggle.classList.remove("collapsed");
  collapseToggle.setAttribute("aria-expanded", "false");
  collapseToggle.setAttribute("aria-label", "打開選單");
  collapse.classList.remove("show");
  document.body.style.overflow = "auto";
}
// 點擊項目隱藏漢堡選單
function handleCollapseMenuClick(event) {
  const target = event.target;
  if (target.classList.contains("collapse__link")) {
    toggleMenu();
  } else if (
    target.classList.contains("collapse__title") &&
    target.tagName.toLowerCase() === "a"
  ) {
    toggleMenu();
  }
}
// 手風琴 menu toggle
function toggleAccordionContent(event) {
  const header = event.currentTarget;
  const accordionItem = header.closest(".accordion__item");
  const accordionSubtitle = header.querySelector(".accordion__header-subtitle");
  const accordionContent = header.nextElementSibling;
  const isActive = header.classList.contains("active");
  accordionSubtitle.textContent = isActive ? "(展開目錄)" : "(縮小目錄)";
  accordionItem.classList.toggle("active", !isActive);
  accordionContent.classList.toggle("active", !isActive);
  header.classList.toggle("active", !isActive);
}
// 頁面跳轉
function redirect(sec) {
  setTimeout(() => {
    try {
      let countdown = Math.floor(sec / 1000);
      console.log("countdown", countdown);
      const countdownElement = document.querySelector("#countdown");
      console.log("countdownElement", countdownElement);
      countdownElement.textContent = countdown;
      console.log("countdownElement", countdownElement);

      // 設置倒數計時器
      const intervalNum = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        console.log("countdown", countdown);
        if (countdown === 0) {
          clearInterval(intervalNum);
          // 倒數結束後返回上一頁
          document.referrer
            ? (window.location.href = document.referrer)
            : window.location.reload();
        }
      }, 1000); // 每秒更新一次
    } catch (error) {
      console.error("跳轉時出錯", error);
    }
  }, 0);
}
// 送出表單互動畫
function animate(isSuccess) {
  console.log("animate", isSuccess);
  const contactForm = document.querySelector(".contact__form");
  const replyElement = document.querySelector("#Reply");
  const replySuccessElement = document.querySelector("#ReplySuccess");
  const replyErrorElement = document.querySelector("#ReplyError");

  // 清空表單並隱藏
  contactForm.innerHTML = "";
  contactForm.style.display = "none";

  // 顯示回覆訊息
  replyElement.classList.remove("hidden");
  replyElement.classList.add("flex");

  if (isSuccess) {
    replySuccessElement.classList.remove("hidden");
    replySuccessElement.classList.add("flex");
    replyErrorElement.classList.remove("flex");
    replyErrorElement.classList.add("hidden");
    // 3 秒後跳轉
    redirect(3000);
  } else {
    replyErrorElement.classList.remove("hidden");
    replyErrorElement.classList.add("flex");
    replySuccessElement.classList.remove("flex");
    replySuccessElement.classList.add("hidden");
  }
}
// 滑到指定元素
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "center",
  });
}
// 顯示提示訊息
function showError(show = true) {
  const errorElement = document.querySelector(".error-message");
  if (errorElement) {
    errorElement.style.opacity = show ? 1 : 0;
  }
}
// 初始化 checkbox 驗證
function setupCheckboxGroup(name) {
  const checkboxes = document.querySelectorAll(name);
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      showError(!isAnyCheckboxChecked([name]));
    });
  });
}
// 確認是否有任何 checkbox 被選中
function isAnyCheckboxChecked(selector) {
  return Array.from(document.querySelectorAll(selector)).some(
    (cb) => cb.checked
  );
}
// 發送表單
function send(e, form) {
  e.preventDefault();
  scrollToElement("#contact__title");

  const servicesChecked = isAnyCheckboxChecked(
    'input[name="contact_services[]"][type="checkbox"]'
  );
  const industryChecked = isAnyCheckboxChecked('input[name="brand_industry"]');
  const citiesChecked = isAnyCheckboxChecked(
    'input[name="sales_cities[]"][type="checkbox"]'
  );

  console.log("servicesChecked", servicesChecked);
  console.log("industryChecked", industryChecked);
  console.log("citiesChecked", citiesChecked);

  if (servicesChecked || industryChecked || citiesChecked) {
    // 創建 FormData
    const formData = new FormData(form);

    // 顯示表單數據（用於測試）
    const formDataObj = {};
    for (let key of formData.keys()) {
      formDataObj[key] = formData.getAll(key);
    }
    console.log(formDataObj);

    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "http://127.0.0.1:9000/api/contact");
    // xhr.open('GET', 'success.json');
    // xhr.open('GET', 'fail.json');
    xhr.send(formData);
    xhr.onreadystatechange = function () {
      try {
        if (xhr.readyState === 4) {
          if (xhr.response.status >= 200 && xhr.response.status < 300) {
            console.log("送出成功", xhr.response.message || xhr.response);
            animate(1); // 成功
          } else {
            console.log("送出失敗", xhr.response.message || xhr.response);
            animate(0); // 失敗
          }
        }
      } catch (error) {
        console.error("回應時出錯", error);
      }
    };

    xhr.onerror = function () {
      console.error("網絡錯誤");
      animate(0); // 網絡錯誤
    };

    // fetch("fail.json", {
    //   // method: "POST",
    //   // mode: 'no-cors',
    //   // body: formData,
    // }).then(
    //     res => {
    //     console.log('聯繫成功', res);
    //     // console.log('聯繫成功', res.json());
    //     return res.json();
    //   },
    //   error => {
    //     console.error('聯繫失敗', error);
    //     animate(0);
    //   }
    // ).then(
    //   res => {
    //     console.log('聯繫成功回傳_res', res);
    //     if (res.status === 200) {
    //       console.log('傳送成功', res.message);
    //       animate(1);
    //     } else {
    //       console.error('傳送失敗', res.message);
    //       animate(0);
    //     }
    //   },
    //   error => {
    //     console.error('聯繫成功_error', error);
    //     animate(0);
    //   }
    // )

    // fetch('success.json')
    // .then(response => {
    //   if (!response.ok) {
    //     throw new Error(`網路錯誤: ${response.status}`);
    //   }
    //   console.log('聯繫成功', response.json());
    //   return response.json();
    // })
    // .then(res => {
    //   if(res.status === 200) {
    //     console.log('傳送成功', res.message);
    //     animate(1);
    //   } else {
    //     console.error('傳送失敗', res.message);
    //     animate(0);
    //   }
    // })
    // .catch(error => {
    //   console.error('Error loading test data:', error);
    //   animate(0);
    // });

    // 模擬回應
    // const isSuccess = Math.random() > 0.5; // 隨機決定成功或失敗
    // // console.log('isSuccess', isSuccess);
    // if (isSuccess) {
    //   setTimeout(() => {
    //     // 成功回應
    //     animate(1);
    //   }, 1000);
    // } else {
    //   setTimeout(() => {
    //     // 失敗回應
    //     animate(1);
    //   }, 1000);
    // }
  } else {
    showError();
    return;
  }
}


document.addEventListener("DOMContentLoaded", function () {
  modifyLinkTargets();
  renderStarRatings();

  // const collapse = document.querySelector(".collapse");
  // const collapseToggle = document.querySelector(".collapse__toggle");

  // collapse.addEventListener("click", handleCollapseMenuClick);
  // collapseToggle.addEventListener("click", toggleMenu);

  // window.addEventListener("resize", () => {
  //   hideMenu(collapse, collapseToggle);
  // });

  const accordionHeader = document.querySelector(".accordion__header");
  if (accordionHeader) {
    accordionHeader.addEventListener("click", toggleAccordionContent);
  }

  // 表單送出
  const form = document.querySelector("#bestdoctorContact");
  if (form) {
    form.addEventListener("submit", (e) => send(e, form));
  }

  // 設置 checkbox 驗證
  setupCheckboxGroup('input[name="contact_services[]"][type="checkbox"]');
  setupCheckboxGroup('input[name="sales_cities[]"][type="checkbox"]');

  // 表單驗證 input
  const inputs = form.querySelectorAll("input[data-validation]");

  const validations = {
    required: (value) => value.trim() !== "" || "此欄位為必填",
    cellPhone: (value) =>
      /^09\d{8}$/.test(value) || "請確認手機格式為： (09XXXXXXXX)",
    companyPhone: (value) =>
      /^[0-9]*$/.test(value) || "請輸入正確的電話號碼格式 (數字)",
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "請輸入有效的電子郵件地址",
  };

  function validateInput(input) {
    const rules = input.dataset.validation.split("|");
    console.log("rules", rules);
    for (let rule of rules) {
      const validationResult = validations[rule](input.value);
      if (typeof validationResult === "string") {
        // 找到包含 error 類的 div
        const errorDiv = input.closest(".text-lg").querySelector(".error");
        if (errorDiv) {
          errorDiv.textContent = validationResult;
        }
        const iconError = input
          .closest(".text-lg")
          .querySelector(".icon-error");
        if (iconError) {
          iconError.style.display = "inline-block";
        }
        console.log("iconError", iconError);

        // input.nextElementSibling.textContent = validationResult;
        console.log("input", input.classList.add("input-error"));
        console.log("input.nextElementSibling", input.nextElementSibling);
        return false;
      }
    }
    const errorDiv = input.closest(".text-lg").querySelector(".error");
    if (errorDiv) {
      errorDiv.textContent = "";
    }
    const iconError = input.closest(".text-lg").querySelector(".icon-error");
    if (iconError) {
      iconError.style.display = "none";
    }

    // input.nextElementSibling.textContent = '';
    input.classList.remove("input-error");
    return true;
  }

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateInput(input));
  });

  form.addEventListener("submit", function (e) {
    let isValid = true;
    inputs.forEach((input) => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    if (!isValid) {
      e.preventDefault();
    }
  });
});

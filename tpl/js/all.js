// 工具函數
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

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

// 配置
const CONFIG = {
  // API_URL: 'http://bestdoctor.lab.net/www/bestdoctor_www/api/api.contact.php',
  // API_URL: 'fail.json',
  // API_URL: 'success.json',
  SELECTORS: {
    FORM: "#bestdoctorContact",
    CONTACT_TITLE: "#contact__title",
    COUNTDOWN: "#countdown",
    REPLY: "#Reply",
    REPLY_SUCCESS: "#ReplySuccess",
    REPLY_ERROR: "#ReplyError",
  },
  REDIRECT_DELAY: 3000,
};
// 表單狀態管理
const FormState = {
  IDLE: "idle",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  ERROR: "error",
  CAPTCHA_ERROR: "captcha_error", // 新增的狀態
};
// 表單處理
function handleFormSubmit(e) {
  // e.preventDefault();
  const form = e.target;

  scrollToElement(CONFIG.SELECTORS.CONTACT_TITLE);
  updateFormState(FormState.SUBMITTING);
  submitForm(form)
    .then((response) => {
      console.log("response", response);
      if (response.status >= 200 && response.status < 300) {
        console.log("傳送成功", response.message);
        updateFormState(FormState.SUCCESS);
        animateSuccess().then(() => {
          // startRedirectCountdown(CONFIG.REDIRECT_DELAY); // 重定向倒計時
          startRedirectCountdown( // 重定向倒計時
            CONFIG.REDIRECT_DELAY,
            "countdown",
            redirectToReferrer
          );
        });
      } else {
        throw new Error(response.message || "傳送失敗");
      }
    })
    .catch((error) => {
      console.error("傳送錯誤", error);
      if ( error.message === "驗證碼錯誤") {
        showCaptchaError(error.message);
      } else {
        updateFormState(FormState.ERROR);
        // showErrorMessage(error.message);
        return animateError();
      }
    });
}
// 表單驗證碼錯誤
function showCaptchaError(message) {
  const errorElement = qs(CONFIG.SELECTORS.REPLY_ERROR);
  const form = qs(CONFIG.SELECTORS.FORM);
  const replyElement = qs(CONFIG.SELECTORS.REPLY);

  form.style.display = "none";
  replyElement.classList.remove("hidden");
  replyElement.classList.add("flex");
  errorElement.classList.remove("hidden");
  errorElement.classList.add("flex");

  const titleElement = errorElement.querySelector(".contact__intro-title");
  if (titleElement) {
    titleElement.textContent = message;
  }

  // 添加倒數文字
  const countdownElement = errorElement.querySelector(".contact__intro-text");
  if (!countdownElement) {
    const newCountdownElement = document.createElement("p");
    newCountdownElement.className = "contact__intro-text";
    newCountdownElement.innerHTML =
      '將在 <span id="captchaCountdown" class="countdown">3</span> 秒後重新顯示表單';
    errorElement.appendChild(newCountdownElement);
  } else {
    countdownElement.innerHTML =
      '將在 <span id="captchaCountdown" class="countdown">3</span> 秒後重新顯示表單';
  }

  startRedirectCountdown(3000, "captchaCountdown", showFormAfterError);
}
// 提交表單
function submitForm(form) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData(form);
    const apiUrl = form.getAttribute("action");
    if (!apiUrl) {
      reject(new Error("表單缺少 action 屬性"));
      return;
    }
    // xhr.open('POST', CONFIG.API_URL, true);
    // xhr.open('GET', CONFIG.API_URL, true);
    xhr.open(form.method || "POST", apiUrl, true);
    xhr.responseType = "json";

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          // const response = JSON.parse(xhr.responseText);
          // const response = xhr.response;
          console.log("response", xhr.response.message || xhr.response);
          resolve(xhr.response);
        } catch (error) {
          console.error("傳送錯誤", error);
          reject(new Error(error));
        }
      } else if (
        xhr.status === 400 &&
        xhr.response.message === "驗證碼錯誤"
      ) {
        console.error(xhr.response?.message || xhr.response);
        reject(new Error("驗證碼錯誤"));
      } else {
        reject(
          new Error(
            `錯誤狀態：${xhr.status}, ${xhr.response?.message || xhr.response || "未知錯誤"}`
          )
        );
      }
    };

    xhr.onerror = function () {
      reject(new Error("網路錯誤"));
    };

    xhr.send(formData);
  });
}
// 更新表單狀態
function updateFormState(state) {
  const form = qs(CONFIG.SELECTORS.FORM);
  form.dataset.state = state;
  updateUIForState(state);
}
// 根據狀態更新畫面
function updateUIForState(state) {
  const replyElement = qs(CONFIG.SELECTORS.REPLY);
  const successElement = qs(CONFIG.SELECTORS.REPLY_SUCCESS);
  const errorElement = qs(CONFIG.SELECTORS.REPLY_ERROR);

  const isReplyVisible =
    state === FormState.SUCCESS || state === FormState.ERROR;
  replyElement.classList.toggle("hidden", !isReplyVisible);
  replyElement.classList.toggle("flex", isReplyVisible);

  const isSuccessVisible = state === FormState.SUCCESS;
  successElement.classList.toggle("hidden", !isSuccessVisible);
  successElement.classList.toggle("flex", isSuccessVisible);

  const isErrorVisible = state === FormState.ERROR;
  errorElement.classList.toggle("hidden", !isErrorVisible);
  errorElement.classList.toggle("flex", isErrorVisible);
}
// 動畫處理-成功
function animateSuccess() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const form = qs(CONFIG.SELECTORS.FORM);
      form.style.display = "none";
      updateUIForState(FormState.SUCCESS);
      resolve();
    });
  });
}
// 動畫處理-失敗
function animateError() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const form = qs(CONFIG.SELECTORS.FORM);
      form.style.display = "none";
      updateUIForState(FormState.ERROR);
      resolve();
    });
  });
}
// 開始重定向倒計時
// function startRedirectCountdown(delay) {
//   const countdownElement = qs(CONFIG.SELECTORS.COUNTDOWN);
//   if (!countdownElement) {
//     console.error("找不到 countdownElement");
//     return;
//   }

//   let timeLeft = Math.floor(delay / 1000);
//   countdownElement.textContent = timeLeft;

//   const updateCountdown = setInterval(() => {
//     timeLeft--;
//     countdownElement.textContent = timeLeft;
//     if (timeLeft === 0) {
//       clearInterval(updateCountdown);
//       // 倒數結束後返回上一頁
//       redirectToReferrer();
//     }
//   }, 1000); // 每秒更新一次
// }
// 開始重定向倒計時
function startRedirectCountdown(delay, elementId, callback) {
  const countdownElement = document.getElementById(elementId);
  if (!countdownElement) {
    console.error(`找不到 ID 為 ${elementId} 的元素`);
    return;
  }

  let timeLeft = Math.floor(delay / 1000);
  countdownElement.textContent = timeLeft;

  const updateCountdown = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(updateCountdown);
      if (typeof callback === "function") {
        callback();
      }
    }
  }, 1000);
}
// 顯示錯誤後重新顯示表單
function showFormAfterError() {
  const errorElement = qs(CONFIG.SELECTORS.REPLY_ERROR);
  const form = qs(CONFIG.SELECTORS.FORM);
  const replyElement = qs(CONFIG.SELECTORS.REPLY);

  replyElement.classList.add("hidden");
  replyElement.classList.remove("flex");
  errorElement.classList.add("hidden");
  errorElement.classList.remove("flex");
  form.style.display = "block";

  // 重新生成驗證碼圖片
  // refreshCaptcha();

  // 滾動到表單頂部
  scrollToElement(CONFIG.SELECTORS.CONTACT_TITLE);
}
// 重定向
function redirectToReferrer() {
  if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    window.location.reload();
  }
}
// 顯示錯誤消息
function showErrorMessage(message) {
  // const errorElement = qs("#ReplyError .contact__intro-title");
  // errorElement.textContent = message;

  const errorElement = qs(CONFIG.SELECTORS.REPLY_ERROR);
  const form = qs(CONFIG.SELECTORS.FORM);
  form.style.display = "none";
  errorElement.innerHTML = `
  <p class="contact__intro-title">${message}</p>
  `;
}
// function scrollToElement(selector) {
//   const element = qs(selector);
//   element.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//       inline: "center",
//     });
//   }
// 滑到指定元素
function scrollToElement(selector) {
  const $element = $(selector);
  if ($element.length) {
    $("html, body").animate(
      {
        scrollTop: $element.offset().top,
      },
      500,
      "swing"
    );
  }
}
// 表單初始化
function initializeForm() {
  const form = qs(CONFIG.SELECTORS.FORM);
  if (form) {
    initializeFormValidation();
    // form.addEventListener("submit", handleFormSubmit);
  }
}
// 初始化表單驗證
function initializeFormValidation() {
  const $form = $(CONFIG.SELECTORS.FORM);
  if (!$form.length) return;

  $form.validate({
    // 表單提交
    submitHandler: function (form, event) {
      event.preventDefault(); // 阻止默認提交行為
      handleFormSubmit(event);
    },
    // 驗證規則
    rules: {
      // contact
      "contact_services[]": {
        checkboxGroup: "input[name='contact_services[]']",
      },
      contact_company: "required",
      contact_company_phone: {
        required: true,
        companyPhone: true,
      },
      contact_your_name: "required",
      contact_your_title: "required",
      contact_your_cellPhone: {
        required: true,
        cellPhone: true,
      },
      contact_your_email: {
        required: true,
        email: true,
      },
      antispam: "required", // 驗證碼
      // brand
      brand_industry: "required",
      brand_company: "required",
      brand_company_phone: {
        required: true,
        companyPhone: true,
      },
      brand_your_name: "required",
      brand_your_cell_phone: {
        required: true,
        cellPhone: true,
      },
      brand_your_email: {
        required: true,
        email: true,
      },
      // sales
      "sales_cities[]": {
        checkboxGroup: "input[name='sales_cities[]']",
      },
      sales_company: "required",
      sales_company_phone: {
        required: true,
        companyPhone: true,
      },
      sales_your_name: "required",
      sales_your_cell_phone: {
        required: true,
        cellPhone: true,
      },
      sales_your_email: {
        required: true,
        email: true,
      },
      sales_about_you: "required",
    },
    // 錯誤訊息
    messages: {
      // contact
      "contact_services[]": {
        checkboxGroup: "請至少勾選一個項目",
      },
      contact_company: "請輸入您的診所名稱",
      contact_company_phone: {
        required: "請輸入診所電話",
        companyPhone: "請確認電話號碼格式為：0X-XXXXXXXX",
      },
      contact_your_name: "請輸入您的姓名",
      contact_your_title: "請輸入您的職稱",
      contact_your_cellPhone: {
        required: "請輸入您的手機號碼",
        cellPhone: "請確認手機格式為：09XXXXXXXX",
      },
      contact_your_email: {
        required: "請輸入您的電子郵件",
        email: "請輸入有效的電子郵件地址",
      },
      antispam: "請輸入驗證碼",
      "sales_cities[]": {
        checkboxGroup: "請至少選擇一個城市",
      },
      // brand
      brand_industry: "請至少選擇一項",
      brand_company: "請輸入您的公司名稱",
      brand_company_phone: {
        required: "請輸入公司電話",
        companyPhone: "請確認電話號碼格式為：0X-XXXXXXXX",
      },
      brand_your_name: "請輸入您的姓名",
      brand_your_cell_phone: {
        required: "請輸入您的手機號碼",
        cellPhone: "請確認手機格式為：09XXXXXXXX",
      },
      brand_your_email: {
        required: "請輸入您的電子郵件",
        email: "請輸入有效的電子郵件地址",
      },
      // sales
      sales_company: "請輸入您的公司名稱",
      sales_company_phone: {
        required: "請輸入公司電話",
        companyPhone: "請確認電話號碼格式為：0X-XXXXXXXX",
      },
      sales_your_name: "請輸入您的姓名",
      sales_your_cell_phone: {
        required: "請輸入您的手機號碼",
        cellPhone: "請確認手機格式為：09XXXXXXXX",
      },
      sales_your_email: {
        required: "請輸入您的電子郵件",
        email: "請輸入有效的電子郵件地址",
      },
      sales_about_you: "請輸入您的業務專長",
    },
    errorElement: "div",
    errorPlacement: customErrorPlacement,
    highlight: customHighlight,
    unhighlight: customUnhighlight,
    // onfocusout: function (element) {
    //   this.element(element);
    // },
    invalidHandler: function (event, validator) {
      if (validator.errorList.length > 0) {
        let firstError = $(validator.errorList[0].element);
        console.log("firstError", firstError);
        $("html, body").animate(
          {
            scrollTop: firstError.offset().top - $(window).height() / 2,
          },
          500
        );
      }
    },
    // invalidHandler: function (event, validator) {
    //   if (validator.errorList.length > 0) {
    //     let firstError = $(validator.errorList[0].element);
    //     console.log("firstError", firstError);
    //     firstError[0].scrollIntoView({ behavior: "smooth" });
    //   }
    // },
  });

  addCustomValidationMethods();
}
// 自定義錯誤訊息放置
function customErrorPlacement(error, element) {
  if (element.attr("type") === "checkbox" || element.attr("type") === "radio") {
    const group = element.closest(".checkbox-group, .radio-group");
    const errorContainer = getOrCreateErrorContainer(group);
    errorContainer.html("").append(createErrorIcon()).append(error);
    error.addClass(element.attr("type") + "-error");
  } else {
    const errorContainer = getOrCreateErrorContainer(element);
    errorContainer.html("").append(createErrorIcon()).append(error);
  }
}
// 取得或創建錯誤訊息容器
function getOrCreateErrorContainer(element) {
  let errorContainer = element.next(".error-container");
  if (!errorContainer.length) {
    errorContainer = $('<div class="error-container"></div>');
    errorContainer.insertAfter(element);
  }
  return errorContainer;
}
// 創建錯誤訊息 icon
function createErrorIcon() {
  return $(`<svg data-encore-id="icon" role="img" aria-label="Error:" fill="#f15e6c" width="16px" height="16px" aria-hidden="true" viewBox="0 0 16 16">
    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
    <path d="M7.25 9V4h1.5v5h-1.5zm0 3.026v-1.5h1.5v1.5h-1.5z"></path>
  </svg>`);
}
// 自定義加上錯誤樣式
function customHighlight(element) {
  const $element = $(element);
  if (
    $element.attr("type") === "checkbox" ||
    $element.attr("type") === "radio"
  ) {
    const group = $element.closest(".checkbox-group, .radio-group");
    group.addClass("input-error");
    group.next(".error-container").show();
  } else {
    $element.addClass("input-error");
    $element.next(".error-container").show();
  }
}
// 自定義移除錯誤樣式
function customUnhighlight(element) {
  const $element = $(element);
  if (
    $element.attr("type") === "checkbox" ||
    $element.attr("type") === "radio"
  ) {
    const group = $element.closest(".checkbox-group, .radio-group");
    group.removeClass("input-error");
    group.next(".error-container").hide();
  } else {
    $element.removeClass("input-error");
    $element.next(".error-container").hide();
  }
}
// 添加自定義驗證方法
function addCustomValidationMethods() {
  $.validator.addMethod(
    "companyPhone",
    function (value, element) {
      return this.optional(element) || /^0[0-9\-+*#,;]*$/.test(value);
    },
    "請確認電話號碼格式為：0X-XXXXXXXX"
  );
  $.validator.addMethod(
    "cellPhone",
    function (value, element) {
      return this.optional(element) || /^09\d{8}$/.test(value);
    },
    "請確認手機格式為：09XXXXXXXX"
  );
  $.validator.addMethod(
    "checkboxGroup",
    function (value, element, param) {
      return $(param + ":checked").length > 0;
    },
    "請至少選擇一個選項"
  );
}
// 初始化
document.addEventListener("DOMContentLoaded", () => {
  initializeForm();
  modifyLinkTargets();
  renderStarRatings();

  const collapse = document.querySelector(".collapse");
  if (!collapse) return;
  const collapseToggle = document.querySelector(".collapse__toggle");
  if (!collapseToggle) return;

  collapse.addEventListener("click", handleCollapseMenuClick);
  collapseToggle.addEventListener("click", toggleMenu);

  window.addEventListener("resize", () => {
    hideMenu(collapse, collapseToggle);
  });

  const accordionHeader = document.querySelector(".accordion__header");
  if (accordionHeader) {
    accordionHeader.addEventListener("click", toggleAccordionContent);
  }
});

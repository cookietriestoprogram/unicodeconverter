function valid_unicode(i) {
  return /^[0-9A-Fa-f]{4,6}$/u.test(i) || parseInt(i) === 0;
}

function valid_UTF16(utf16Text) {
  // Regular expression pattern to match valid UTF-16 encoded characters
  return /^[0-9A-Fa-f]{8}$/u.test(utf16Text);
}
function valid_UTF32(utf32Text) {
  // Regular expression pattern to match valid UTF-32 encoded characters
  return /^[0-9A-Fa-f]{8}$/u.test(utf32Text);
}

function clearInputs() {
  console.log("clearing inputs");
  document.getElementById("download-btn").style.display = "none";
  document.getElementById("unicode").value = "";
  document.getElementById("utf8").value = "";
  document.getElementById("utf16").value = "";
  document.getElementById("utf32").value = "";
  document.getElementById("utf8steps").innerHTML = "";
  document.getElementById("utf16steps").innerHTML = "";
}

function enableDownloadButton() {
  document.getElementById("download-btn").style.display = "block";
}

function changeName() {
  clearInputs();

  const unicodeInput = document.getElementById("unicode");
  const utf16Input = document.getElementById("utf16");
  const utf8Input = document.getElementById("utf8");
  const utf32Input = document.getElementById("utf32");

  const translate = document.getElementById("toggle").checked;
  const btn = document.getElementById("submit-btn");
  const title = document.getElementById("title");
  const steps8 = document.getElementById("8steps");
  const steps16 = document.getElementById("16steps");

  if (!translate) {
    enableUTFTranslation(
      title,
      btn,
      utf16Input,
      utf8Input,
      utf32Input,
      steps8,
      steps16
    );
    disableUnicodeInput(unicodeInput);
  } else {
    enableUnicodeConversion(title, btn, unicodeInput, steps8, steps16);
    disableUTFInputs(utf16Input, utf8Input, utf32Input);
  }
}

function enableUTFTranslation(
  title,
  btn,
  utf16Input,
  utf8Input,
  utf32Input,
  steps8,
  steps16
) {
  title.textContent = "UTF Translator";
  steps8.textContent = "UTF 8 to Unicode Steps";
  steps16.textContent = "UTF 16 to Unicode Steps";
  btn.textContent = "Translate";
  utf8Input.placeholder = "Ex: F090BFBF";
  utf16Input.placeholder = "Ex: D803DFFF";
  utf32Input.placeholder = "Ex: 00010FFF";

  let inputs = [utf16Input, utf8Input, utf32Input];

  inputs.forEach((input) => {
    input.disabled = false;
    input.classList.remove("disabled");
  });
}

function disableUnicodeInput(unicodeInput) {
  unicodeInput.disabled = true;
  unicodeInput.classList.add("disabled");
  unicodeInput.placeholder = "";
}

function enableUnicodeConversion(title, btn, unicodeInput, steps8, steps16) {
  title.textContent = "Unicode Converter";
  steps8.textContent = "Unicode to UTF 8 Steps";
  steps16.textContent = "Unicode to UTF 16 Steps";
  btn.textContent = "Convert";
  unicodeInput.disabled = false;
  unicodeInput.classList.remove("disabled");
  unicodeInput.placeholder = "Enter Unicode (e.g., 20AC)";
}

function disableUTFInputs(utf16Input, utf8Input, utf32Input) {
  let inputs = [utf16Input, utf8Input, utf32Input];

  inputs.forEach((input) => {
    input.disabled = true;
    input.placeholder = "";
    input.classList.add("disabled");
    // console.log(input)
  });
}

function convert() {
  var translate = document.getElementById("toggle").checked;
  var unicodeInput = document.getElementById("unicode").value;
  let utf16Input = document.getElementById("utf16").value;
  let utf32Input = document.getElementById("utf32").value.padStart(8, "0");
  let utf8Input = document.getElementById("utf8").value;

  if (translate == false) {
    if (
      !valid_unicode(unicodeInput) ||
      (utf16Input != "" && unicodeInput == "")
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid Unicode character!",
      });
      return;
    }
  } else {
    //UTF-16 valid checker
    if (utf16Input != "") {
      if (!valid_UTF16(utf16Input)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please enter a valid UTF-16 character!",
        });
        return;
      }
    }

    //UTF-32 valid checker
    if (utf32Input != "") {
      if (!valid_UTF32(utf32Input)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please enter a valid UTF-32 character!",
        });
        return;
      }
    }

    // UTF-16 to Unicode
    if (utf16Input != "") {
      var utf16 = parseInt(utf16Input, 16);
      if ((utf16) => 0xffff) {
        var unicodeRep = translateUTF16(utf16);
      }

      let steps16 = generateUTF16toUnicodeSteps(utf16);
      document.getElementById("utf16steps").innerHTML = steps16;

      document.getElementById("unicode").value =
        "U+" + unicodeRep.toUpperCase();
      enableDownloadButton();

      return;
    }

    if (utf32Input != "") {
      var unicodeRep = "U+" + utf32Input.replace(/^0+/, "").toUpperCase();
      document.getElementById("unicode").value = unicodeRep;

      enableDownloadButton();
      return;
    }

    if(utf8Input != ""){
      var unicodeRep = "U+" + translateUTF8(utf8Input).toUpperCase();
      document.getElementById("unicode").value = unicodeRep;
      enableDownloadButton();
      return  0;
    }
  }

  // UNICODE to UTF
  var codepoint = parseInt(unicodeInput, 16);
  console.log(codepoint)
  var utf8 = "0x " + convertToUTF8(codepoint).toUpperCase();
  var utf8Steps = generateUTF8ConversionSteps(codepoint);

  var utf16 = "0x " + convertToUTF16(codepoint).toUpperCase();
  var utf16Steps = generateUTF16ConversionSteps(codepoint);

  document.getElementById("utf8").value = utf8;

  document.getElementById("utf16").value = utf16;
  document.getElementById("utf32").value =
    "0x " + codepoint.toString(16).padStart(8, "0").toUpperCase();

  document.getElementById("utf8steps").innerHTML = utf8Steps;
  document.getElementById("utf16steps").innerHTML = utf16Steps;

  enableDownloadButton();
}

function translateUTF16(utf16) {
  const upper = Math.floor(utf16 / 0x10000) - 0xd800;
  const lower = (utf16 % 0x10000) - 0xdc00;

  const unicodeCodePoint = (upper << 10) + lower + 0x10000;

  return unicodeCodePoint.toString(16);
}

function generateUTF16toUnicodeSteps(utf16) {
  let steps = [];

  const upper = Math.floor(utf16 / 0x10000) - 0xd800;
  const lower = (utf16 % 0x10000) - 0xdc00;

  const unicodeCodePoint = (upper << 10) + lower + 0x10000;

  //fixed part
  steps.push(
    "1: Separate the UTF-16 code unit into upper and lower surrogates."
  );
  steps.push(
    `2: Calculate the upper surrogate value by subtracting 0xd800 from the high-surrogate code unit: ${Math.floor(
      utf16 / 0x10000
    )
      .toString(16)
      .toUpperCase()}.`
  );
  steps.push(
    `3: Calculate the lower surrogate value by subtracting 0xdc00 from the low-surrogate code unit: ${(
      utf16 % 0x10000
    )
      .toString(16)
      .toUpperCase()}.`
  );
  steps.push(
    `4: Combine the upper and lower surrogates and add 0x10000 to obtain the Unicode code point.`
  );
  steps.push(
    `5: The Unicode code point corresponding to the given UTF-16 code unit is: ${unicodeCodePoint
      .toString(16)
      .toUpperCase()}.`
  );

  return steps.join(" <br> ");
}

function translateUTF8(utf8Hex) {
  utf8Hex = utf8Hex.replace(/\s/g, '');

  const hexPairs = utf8Hex.match(/.{1,2}/g);

  const bytes = hexPairs.map(hex => parseInt(hex, 16));

  let codepoint = 0;
  if (bytes.length === 1) {
    codepoint = bytes[0];
  } else if (bytes.length === 2) {
    codepoint = ((bytes[0] - 0xC0) << 6) + (bytes[1] - 0x80);
  } else if (bytes.length === 3) {
    codepoint = ((bytes[0] - 0xE0) << 12) + ((bytes[1] - 0x80) << 6) + (bytes[2] - 0x80);
  } else if (bytes.length === 4) {
    codepoint = ((bytes[0] - 0xF0) << 18) + ((bytes[1] - 0x80) << 12) + ((bytes[2] - 0x80) << 6) + (bytes[3] - 0x80);
  }

  return codepoint.toString(16);
}


function convertToUTF8(codepoint) {
  if (codepoint <= 0x7f) {
    return codepoint.toString(16).padStart(2, "0");
  } else if (codepoint <= 0x7ff) {
    return (
      "0x " +
      ((codepoint >> 6) + 0xc0).toString(16).padStart(2, "0") +
      " " +
      ((codepoint & 0x3f) + 0x80).toString(16).padStart(2, "0")
    );
  } else if (codepoint <= 0xffff) {
    return (
      ((codepoint >> 12) + 0xe0).toString(16).padStart(2, "0") +
      " " +
      (((codepoint >> 6) & 0x3f) + 0x80).toString(16).padStart(2, "0") +
      " " +
      ((codepoint & 0x3f) + 0x80).toString(16).padStart(2, "0")
    );
  } else {
    return (
      ((codepoint >> 18) + 0xf0).toString(16).padStart(2, "0") +
      " " +
      (((codepoint >> 12) & 0x3f) + 0x80).toString(16).padStart(2, "0") +
      " " +
      (((codepoint >> 6) & 0x3f) + 0x80).toString(16).padStart(2, "0") +
      " " +
      ((codepoint & 0x3f) + 0x80).toString(16).padStart(2, "0")
    );
  }
}

function generateUTF8ConversionSteps(codepoint) {
  let steps = [];

  if (codepoint <= 0x7f) {
    steps.push(
      "Step 1: This Unicode code point can be represented by a single byte in UTF-8."
    );
    steps.push(
      `Step 2: Convert the code point ${codepoint
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()} to UTF-8 byte: ${codepoint
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()}.`
    );
  } else if (codepoint <= 0x7ff) {
    const byte1 = (codepoint >> 6) + 0xc0;
    const byte2 = (codepoint & 0x3f) + 0x80;
    steps.push(
      "Step 1: This Unicode code point requires two bytes for UTF-8 encoding."
    );
    steps.push(
      `Step 2: Calculate the first byte: 110xxxxx, where the first 5 bits of the code point are ${byte1
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 3: Calculate the second byte: 10xxxxxx, where the last 6 bits of the code point are ${byte2
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 4: Convert the code point ${codepoint
        .toString(16)
        .padStart(4, "0")
        .toUpperCase()} to UTF-8: ${byte1
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()} ${byte2.toString(16).padStart(2, "0").toUpperCase()}.`
    );
  } else if (codepoint <= 0xffff) {
    const byte1 = (codepoint >> 12) + 0xe0;
    const byte2 = ((codepoint >> 6) & 0x3f) + 0x80;
    const byte3 = (codepoint & 0x3f) + 0x80;
    steps.push(
      "Step 1: This Unicode code point requires three bytes for UTF-8 encoding."
    );
    steps.push(
      `Step 2: Calculate the first byte: 1110xxxx, where the first 4 bits of the code point are ${byte1
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 3: Calculate the second byte: 10xxxxxx, where the middle 6 bits of the code point are ${byte2
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 4: Calculate the third byte: 10xxxxxx, where the last 6 bits of the code point are ${byte3
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 5: Convert the code point ${codepoint
        .toString(16)
        .padStart(6, "0")
        .toUpperCase()} to UTF-8: ${byte1
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()} ${byte2
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()} ${byte3.toString(16).padStart(2, "0").toUpperCase()}.`
    );
  } else {
    const byte1 = (codepoint >> 18) + 0xf0;
    const byte2 = ((codepoint >> 12) & 0x3f) + 0x80;
    const byte3 = ((codepoint >> 6) & 0x3f) + 0x80;
    const byte4 = (codepoint & 0x3f) + 0x80;
    steps.push(
      "Step 1: This Unicode code point requires four bytes for UTF-8 encoding."
    );
    steps.push(
      `Step 2: Calculate the first byte: 11110xxx, where the first 3 bits of the code point are ${byte1
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 3: Calculate the second byte: 10xxxxxx, where the second 6 bits of the code point are ${byte2
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 4: Calculate the third byte: 10xxxxxx, where the third 6 bits of the code point are ${byte3
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 5: Calculate the fourth byte: 10xxxxxx, where the last 6 bits of the code point are ${byte4
        .toString(2)
        .padStart(8, "0")} (binary).`
    );
    steps.push(
      `Step 6: Convert the code point ${codepoint
        .toString(16)
        .padStart(8, "0")
        .toUpperCase()} to UTF-8: ${byte1
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()} ${byte2
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()} ${byte3
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()} ${byte4.toString(16).padStart(2, "0").toUpperCase()}.`
    );
  }

  return steps.join("<br>");
}

function convertToUTF16(codepoint) {
  if (codepoint <= 0xffff) {
    return codepoint.toString(16).padStart(4, "0");
  } else {
    var highSurrogate = Math.floor((codepoint - 0x10000) / 0x400) + 0xd800;
    var lowSurrogate = ((codepoint - 0x10000) % 0x400) + 0xdc00;
    return (
      highSurrogate.toString(16).padStart(4, "0") +
      " " +
      lowSurrogate.toString(16).padStart(4, "0")
    );
  }
}

function generateUTF16ConversionSteps(codepoint) {
  let steps = [];

  if (codepoint <= 0xffff) {
    steps.push(
      "Step 1: This Unicode code point can be represented by a single UTF-16 code unit."
    );
    steps.push(
      `Step 2: Convert the code point ${codepoint
        .toString(16)
        .padStart(4, "0")
        .toUpperCase()} to UTF-16: ${
        "0x" + codepoint.toString(16).padStart(4, "0").toUpperCase()
      }.`
    );
  } else {
    const subtracted = codepoint - 0x10000;
    const highSurrogate = Math.floor((codepoint - 0x10000) / 0x400) + 0xd800;
    const lowSurrogate = ((codepoint - 0x10000) % 0x400) + 0xdc00;
    const highSurrogateBinary = (highSurrogate - 0xd800)
      .toString(2)
      .padStart(10, "0");
    const lowSurrogateBinary = (lowSurrogate - 0xdc00)
      .toString(2)
      .padStart(10, "0");

    steps.push(
      "Step 1: This Unicode code point requires two UTF-16 code units (surrogate pair) for representation."
    );
    steps.push(`Step 2: Calculate the high surrogate:`);
    steps.push(
      `        - Subtract 0x10000 from the code point to get a 20-bit number in binary ${subtracted
        .toString(2)
        .padStart(20, "0")}.`
    );
    steps.push(`        - Separate the top ten bits: ${highSurrogateBinary}`);
    steps.push(
      `        - Add 0xD800 to these ten bits to obtain the high surrogate: ${highSurrogate
        .toString(16)
        .padStart(4, "0")
        .toUpperCase()}.`
    );
    steps.push(`Step 3: Calculate the low surrogate:`);
    steps.push(
      `        - Take the remainder of dividing the code point by 0x400.`
    );
    steps.push(`        - Separate the low ten bits: ${lowSurrogateBinary}`);
    steps.push(
      `        - Add 0xDC00 to these ten bits to obtain the low surrogate: ${lowSurrogate
        .toString(16)
        .padStart(4, "0")
        .toUpperCase()}.`
    );
    steps.push(
      `Step 4: Combine the high and low surrogates to represent the code point.`
    );
    steps.push(
      `Step 5: Convert the code point ${codepoint
        .toString(16)
        .padStart(6, "0")
        .toUpperCase()} to UTF-16: ${
        "0x" + highSurrogate.toString(16).padStart(4, "0").toUpperCase()
      } ${"0x" + lowSurrogate.toString(16).padStart(4, "0").toUpperCase()}.`
    );
  }

  return steps.join("<br>");
}

function initialize() {
  const unicodeInput = document.getElementById("unicode");
  const utf16Input = document.getElementById("utf16");
  const utf8Input = document.getElementById("utf8");
  const utf32Input = document.getElementById("utf32");

  disableUTFInputs(utf16Input, utf8Input, utf32Input);
}

document.addEventListener("DOMContentLoaded", function (event) {
  initialize();
});

function downloadToText() {
  const unicodeInput = document.getElementById("unicode").value;
  const utf16Input = document.getElementById("utf16").value;
  const utf8Input = document.getElementById("utf8").value;
  const utf32Input = document.getElementById("utf32").value;

  const combinedContent = `Unicode: ${unicodeInput}\nUTF-16: ${utf16Input}\nUTF-8: ${utf8Input}\nUTF-32: ${utf32Input}`;

  const blob = new Blob([combinedContent], { type: "text/plain" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "text_file.txt";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

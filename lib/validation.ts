/**
 * Biểu thức chính quy cho số điện thoại Việt Nam
 * - Bắt đầu bằng 0
 * - Độ dài tổng cộng là 10 số
 */
// Regex cho số điện thoại Việt Nam (03x, 05x, 07x, 08x, 09x)
export const VN_PHONE_REGEX = /^0[0-9]{9}$/;

export const validatePhoneNumber = (phone: string) => {
  return VN_PHONE_REGEX.test(phone);
};

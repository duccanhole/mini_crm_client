/**
 * Biểu thức chính quy cho số điện thoại Việt Nam
 * - Bắt đầu bằng 0
 * - Theo sau là:
 *   - 3x, 5x, 7x, 8x, 9x (Các đầu số di động hiện tại)
 *   - Độ dài tổng cộng là 10 số
 */
// Regex cho số điện thoại Việt Nam (03x, 05x, 07x, 08x, 09x)
export const VN_PHONE_REGEX = /^0(3|5|7|8|9)[0-9]{8}$/;

export const validatePhoneNumber = (phone: string) => {
  return VN_PHONE_REGEX.test(phone);
};

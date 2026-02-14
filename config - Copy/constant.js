const SYSTEM_CONSTANTS = {
  INTERNAL_SERVER_ERROR: {
    en: "We're having trouble right now, please try again shortly.",
    ar: "نواجه مشكلة حالياً، يرجى المحاولة مرة أخرى قريباً."
  }
};

const ADMIN_CONSTANTS = {
  LOGIN_SUCCESS: {
    en: "Admin login successfully",
    ar: "تسجيل دخول المشرف بنجاح"
  },
  VIEW_PROFILE_SUCCESS: {
    en: "View profile successful",
    ar: "عرض الملف الشخصي بنجاح"
  },
  NOT_FOUND: {
    en: "Admin not found",
    ar: "المشرف غير موجود"
  },
  INVALID_EMAIL: {
    en: "Admin not found with this email",
    ar: "لم يتم العثور على المشرف بهذا البريد الإلكتروني"
  },
  INVALID_PASSWORD: {
    en: "Invalid password",
    ar: "كلمة المرور غير صحيحة"
  },
  INVALID_CURRENT_PASSWORD: {
    en: "Invalid current password",
    ar: "كلمة المرور الحالية غير صحيحة"
  },
  PASSWORD_RESET_SUCCESS: {
    en: "Your password has been successfully updated",
    ar: "تم تحديث كلمة المرور الخاصة بك بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Details updated successfully",
    ar: "تم تحديث التفاصيل بنجاح"
  },
  LOGOUT_SUCCESS: {
    en: "Logged out successfully",
    ar: "تم تسجيل الخروج بنجاح"
  },
  SUCCESS: {
    en: "Success",
    ar: "نجاح"
  }
};

const MANAGER_CONSTANTS = {
  LOGIN_SUCCESS: {
    en: "Manager login successfully",
    ar: "تسجيل دخول المدير بنجاح"
  },
  VIEW_PROFILE_SUCCESS: {
    en: "View profile successful",
    ar: "عرض الملف الشخصي بنجاح"
  },
  REGISTER_SUCCESS: {
    en: "Manager registered successfully",
    ar: "تم تسجيل المدير بنجاح"
  },
  EMAIL_ALREADY_EXISTS: {
    en: "Manager with this email already exists",
    ar: "المدير مع هذا البريد الإلكتروني موجود بالفعل"
  },
  NOT_FOUND: {
    en: "Manager not found",
    ar: "المدير غير موجود"
  },
  INVALID_EMAIL: {
    en: "Manager not found with this email",
    ar: "لم يتم العثور على المدير بهذا البريد الإلكتروني"
  },
  INVALID_PASSWORD: {
    en: "Invalid password",
    ar: "كلمة المرور غير صحيحة"
  },
  INVALID_CURRENT_PASSWORD: {
    en: "Invalid current password",
    ar: "كلمة المرور الحالية غير صحيحة"
  },
  PASSWORD_RESET_SUCCESS: {
    en: "Your password has been successfully updated",
    ar: "تم تحديث كلمة المرور الخاصة بك بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Details updated successfully",
    ar: "تم تحديث التفاصيل بنجاح"
  },
  DELETE_SUCCESS: {
    en: "Deleted successfully",
    ar: "تم الحذف بنجاح"
  },
  LOGOUT_SUCCESS: {
    en: "Logged out successfully",
    ar: "تم تسجيل الخروج بنجاح"
  },
  MANAGER_LIST_SUCCESS: {
    en: "Manager fetched successfully",
    ar: "تم جلب المدير بنجاح"
  },
  SUCCESS: {
    en: "Success",
    ar: "نجاح"
  }
};

const MIDDLEWARE_AUTH_CONSTANTS = {
  ACCESS_DENIED: {
    en: "Access denied! No Token provided.",
    ar: "تم رفض الوصول! لم يتم تقديم رمز."
  },
  RESOURCE_FORBIDDEN: {
    en: "You don't have access to the requested resource.",
    ar: "ليس لديك إمكانية الوصول إلى المورد المطلوب."
  },
  INVALID_AUTH_TOKEN: {
    en: "Invalid Token.",
    ar: "رمز غير صالح."
  },
  EXPIRED_TOKEN: {
    en: "Token has been expired.",
    ar: "انتهت صلاحية الرمز."
  },
  VERIFICATION_FAILED: {
    en: "Token verification failed.",
    ar: "فشل التحقق من الرمز."
  }
};

const AUTH_CONSTANTS = {
  NO_ACCESS: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED,
  INVALID_USER: {
    en: "User not found.",
    ar: "المستخدم غير موجود."
  },
  INVALID_CREDENTIALS: {
    en: "Invalid email or password.",
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة."
  },
  INVALID_PASSWORD: {
    en: "You have entered incorrect password. Please try again with valid password.",
    ar: "لقد أدخلت كلمة مرور غير صحيحة. يرجى المحاولة مرة أخرى بكلمة مرور صالحة."
  },
  PASSWORD_CHANGE_SUCCESS: {
    en: "Password changed successfully.",
    ar: "تم تغيير كلمة المرور بنجاح."
  }
};

const OTP_CONSTANTS = {
  INVALID_OTP: {
    en: "OTP is not valid.",
    ar: "رمز التحقق غير صالح."
  },
  NO_USER_REGISTERED_EMAIL: {
    en: "No user registered with this email.",
    ar: "لا يوجد مستخدم مسجل بهذا البريد الإلكتروني."
  },
  DUPLICATE_EMAIL: {
    en: "Email entered is already registered. Please try to login.",
    ar: "البريد الإلكتروني المدخل مسجل بالفعل. يرجى محاولة تسجيل الدخول."
  },
  OTP_GENERATED: {
    en: "Verification code generated successfully.",
    ar: "تم إنشاء رمز التحقق بنجاح."
  },
  OTP_MAX_LIMIT_ERROR: {
    en: "Max attempts to verify code breached.",
    ar: "تم تجاوز الحد الأقصى لمحاولات التحقق من الرمز."
  },
  OTP_EXPIRED: {
    en: "Verification code expired.",
    ar: "انتهت صلاحية رمز التحقق."
  },
  ACCOUNT_NOT_ACTIVE: {
    en: "Your account is not active.",
    ar: "حسابك غير نشط."
  }
};

const USER_CONSTANTS = {
  EMAIL_ALREADY_EXISTS: {
    en: "This email is already registered",
    ar: "هذا البريد الإلكتروني مسجل بالفعل"
  },
  MOBILE_ALREADY_EXISTS: {
    en: "This mobile number is already registered",
    ar: "رقم الهاتف المحمول هذا مسجل بالفعل"
  },
  USER_NAME_CREATION_SUCCESS: {
    en: "User name created successfully.",
    ar: "تم إنشاء اسم المستخدم بنجاح."
  },
  NO_SWIPED_USER_FOUND: {
    en: "No swiped user found.",
    ar: "لم يتم العثور على مستخدم تم تمريره."
  },
  USERNAME_ALREADY_EXISTS: {
    en: "User already exists with this userName.",
    ar: "المستخدم موجود بالفعل بهذا الاسم."
  },
  INVALID_ID: {
    en: "Invalid objectID.",
    ar: "معرف الكائن غير صالح."
  },
  USER_CREATED_SUCCESS: {
    en: "User registered successfully.",
    ar: "تم تسجيل المستخدم بنجاح."
  },
  LOGIN_SUCCESS: {
    en: "Logged in successfully.",
    ar: "تم تسجيل الدخول بنجاح."
  },
  VIEW_PROFILE_SUCCESS: {
    en: "You are currently viewing your profile.",
    ar: "أنت تشاهد ملفك الشخصي حاليًا."
  },
  EDIT_PROFILE_SUCCESS: {
    en: "Your profile has been updated successfully.",
    ar: "تم تحديث ملفك الشخصي بنجاح."
  },
  NO_USER_FOUND_EMAIL: {
    en: "No user found with this email.",
    ar: "لم يتم العثور على مستخدم بهذا البريد الإلكتروني."
  },
  PASSWORD_RESET_SUCCESS: {
    en: "Your password has been successfully reset.",
    ar: "تم إعادة تعيين كلمة المرور الخاصة بك بنجاح."
  },
  LOGOUT_SUCCESS: {
    en: "Logged out successfully.",
    ar: "تم تسجيل الخروج بنجاح."
  },
  USER_ALREADY_EXISTS: {
    en: "User already exists with these details.",
    ar: "المستخدم موجود بالفعل بهذه التفاصيل."
  },
  VERIFICATION_EMAIL_SUCCESS: {
    en: "This email has been successfully verified.",
    ar: "تم التحقق من هذا البريد الإلكتروني بنجاح."
  },
  DASHBOARD_VIEW: {
    en: "You are currently viewing your dashboard.",
    ar: "أنت تشاهد لوحة التحكم الخاصة بك حاليًا."
  },
  NOT_FOUND: {
    en: "User not found.",
    ar: "المستخدم غير موجود."
  },
  PASSWORD_CHANGE_SUCCESS: {
    en: "Password changed successfully.",
    ar: "تم تغيير كلمة المرور بنجاح."
  },
  INVALID_OLD_PASSWORD: {
    en: "Incorrect old password.",
    ar: "كلمة المرور القديمة غير صحيحة."
  },
  DELETED_SUCCESSFULLY: {
    en: "This user is deleted successfully.",
    ar: "تم حذف هذا المستخدم بنجاح."
  },
  LOCATION_ADDED: {
    en: "Location added to your profile.",
    ar: "تم إضافة الموقع إلى ملفك الشخصي."
  },
  YOU_NEED_TO_ADD_PAYOUT_CARD: {
    en: "You need to add a payout card.",
    ar: "تحتاج إلى إضافة بطاقة دفع."
  },
  ONBOARDING_NEEDED_FOR_FUNDRAISERS: {
    en: "You are not allowed to create a fundraiser until you onboard with Stripe. Please go to the 'My Profile' section or click on below button and complete the onboarding process.",
    ar: "لا يُسمح لك بإنشاء حملة جمع تبرعات حتى تقوم بالتسجيل مع Stripe. يرجى الذهاب إلى قسم 'ملفي الشخصي' أو النقر على الزر أدناه وإكمال عملية التسجيل."
  },
  ONBOARDING_NEEDED_FOR_SERVICES: {
    en: "You are not allowed to create a service until you onboard with Stripe. Please go to the 'My Profile' section or click on below button and complete the onboarding process.",
    ar: "لا يُسمح لك بإنشاء خدمة حتى تقوم بالتسجيل مع Stripe. يرجى الذهاب إلى قسم 'ملفي الشخصي' أو النقر على الزر أدناه وإكمال عملية التسجيل."
  },
  ONBOARDED_SUCCESSFULLY: {
    en: "Onboarded successfully!",
    ar: "تم التسجيل بنجاح!"
  },
  ALREADY_ONBOARDED: {
    en: "You are already onboarded with Stripe.",
    ar: "أنت مسجل بالفعل مع Stripe."
  },
  USER_LIST_SUCCESS: {
    en: "User list fetched successfully",
    ar: "تم جلب قائمة المستخدمين بنجاح"
  },
  USERID_REQUIRED: {
    en: "UserId is required",
    ar: "معرف المستخدم مطلوب"
  }
};

const SUPPORT_TICKET_CONSTANTS = {
  CREATE_SUCCESS: {
    en: "Support ticket created successfully",
    ar: "تم إنشاء تذكرة الدعم بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Support ticket updated successfully",
    ar: "تم تحديث تذكرة الدعم بنجاح"
  },
  VIEW_SUCCESS: {
    en: "Support ticket retrieved successfully",
    ar: "تم استرجاع تذكرة الدعم بنجاح"
  },
  LIST_SUCCESS: {
    en: "Support ticket list fetched successfully",
    ar: "تم جلب قائمة تذكرة الدعم بنجاح"
  },
  DELETE_SUCCESS: {
    en: "Support ticket deleted successfully",
    ar: "تم حذف تذكرة الدعم بنجاح"
  },
  NOT_FOUND: {
    en: "Support ticket not found",
    ar: "تذكرة الدعم غير موجودة"
  },
  INVALID_TICKET_ID: {
    en: "Invalid ticket ID",
    ar: "معرف التذكرة غير صالح"
  },
  UNAUTHORIZED: {
    en: "You don't have access to this ticket",
    ar: "ليس لديك إمكانية الوصول إلى هذه التذكرة"
  },
  SUCCESS: {
    en: "Success",
    ar: "نجاح"
  }
};


const CATEGORY_CONSTANTS = {
  CREATE_SUCCESS: {
    en: "Category created successfully",
    ar: "تم إنشاء الفئة بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Category updated successfully",
    ar: "تم تحديث الفئة بنجاح"
  },
  DELETE_SUCCESS: {
    en: "Category deleted successfully",
    ar: "تم حذف الفئة بنجاح"
  },
  LIST_SUCCESS: {
    en: "Categories retrieved successfully",
    ar: "تم استرجاع الفئات بنجاح"
  },
  NAME_EXISTS: {
    en: "Category name already exists",
    ar: "اسم الفئة موجود بالفعل"
  },
  INVALID_CATEGORY_ID: {
    en: "Invalid category ID",
    ar: "معرف الفئة غير صالح"
  },
  NOT_FOUND: {
    en: "Category not found",
    ar: "الفئة غير موجودة"
  },
  CATEGORY_IN_USE: {
    en: "Category is in use by active insurance policies",
    ar: "الفئة مستخدمة بواسطة وثائق التأمين النشطة"
  }
};

const FILE_UPLOAD_CONSTANTS = {
  FILE_UPLOAD_SUCCESS: {
    en: "File uploaded successfully.",
    ar: "تم رفع الملف بنجاح."
  },
  FILE_EXPORT_SUCCESS: {
    en: "File exported successfully.",
    ar: "تم تصدير الملف بنجاح."
  },
  ONLY_EXCEL_ALLOWED: {
    en: "Invalid file type. Only Excel files are allowed.",
    ar: "نوع الملف غير صالح. يُسمح فقط بملفات Excel."
  },
  NO_FILE_UPLOADED: {
    en: "Please upload a media file.",
    ar: "يرجى رفع ملف وسائط."
  }
};

const BANNER_CONSTANTS = {
  CREATE_SUCCESS: {
    en: "Journal created successfully",
    ar: "تم إنشاء اللافتة بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Journal updated successfully",
    ar: "تم تحديث اللافتة بنجاح"
  },
  DELETE_SUCCESS: {
    en: "Journal deleted successfully",
    ar: "تم حذف اللافتة بنجاح"
  },
  LIST_SUCCESS: {
    en: "Journal listed successfully",
    ar: "تم سرد اللافتات بنجاح"
  },
  INVALID_BANNER_ID: {
    en: "Invalid Journal ID",
    ar: "معرف اللافتة غير صالح"
  },
  NOT_FOUND: {
    en: "Journal not found",
    ar: "اللافتة غير موجودة"
  }
};
const JOURNAL_CONSTANTS = {
  CREATE_SUCCESS: {
    en: "Journal created successfully",
    ar: "تم إنشاء اللافتة بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Journal updated successfully",
    ar: "تم تحديث اللافتة بنجاح"
  },
  DELETE_SUCCESS: {
    en: "Journal deleted successfully",
    ar: "تم حذف اللافتة بنجاح"
  },
  LIST_SUCCESS: {
    en: "Journal listed successfully",
    ar: "تم سرد اللافتات بنجاح"
  },
  INVALID_JOURNAL_ID: {
    en: "Invalid Journal ID",
    ar: "معرف اللافتة غير صالح"
  },
  NOT_FOUND: {
    en: "Journal not found",
    ar: "اللافتة غير موجودة"
  }
};

const TOPIC_CONSTANTS = {
  CREATE_SUCCESS: {
    en: "Topic created successfully",
    ar: "تم إنشاء اللافتة بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Topic updated successfully",
    ar: "تم تحديث اللافتة بنجاح"
  },
  DELETE_SUCCESS: {
    en: "Topic deleted successfully",
    ar: "تم حذف اللافتة بنجاح"
  },
  LIST_SUCCESS: {
    en: "Topic listed successfully",
    ar: "تم سرد اللافتات بنجاح"
  },
  INVALID_TOPIC_ID: {
    en: "Invalid Topic ID",
    ar: "معرف اللافتة غير صالح"
  },
  NOT_FOUND: {
    en: "Topic not found",
    ar: "اللافتة غير موجودة"
  },
  REORDER_SUCCESS: {
    en: "Topics reordered successfully",
    ar: "تم إعادة ترتيب المواضيع بنجاح"
  }
};
const CONFERENCE_CONSTANTS = {
  CREATE_SUCCESS: {
    en: "Journal created successfully",
    ar: "تم إنشاء اللافتة بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Journal updated successfully",
    ar: "تم تحديث اللافتة بنجاح"
  },
  DELETE_SUCCESS: {
    en: "Journal deleted successfully",
    ar: "تم حذف اللافتة بنجاح"
  },
  LIST_SUCCESS: {
    en: "Journal listed successfully",
    ar: "تم سرد اللافتات بنجاح"
  },
  INVALID_CONFERENCE_ID: {
    en: "Invalid Conference ID",
    ar: "معرف اللافتة غير صالح"
  },
  NOT_FOUND: {
    en: "Journal not found",
    ar: "اللافتة غير موجودة"
  }
};
const VALIDATION_CONSTANTS = {
  USERID_REQUIRED: {
    en: "User ID is required",
    ar: "معرف المستخدم مطلوب"
  }
};

const COUPON_CONSTANTS = {
  INVALID_COUPON: {
    en: "Coupon with given ID not found",
    ar: "القسيمة مع المعرف المحدد غير موجودة"
  },
  COUPONFOR_MANDATORY: {
    en: "couponFor is mandatory query parameter.",
    ar: "couponFor هو معلمة استعلام إلزامية."
  },
  INVALID_FREE_COUPON: {
    en: "This coupon is only valid for 18th and 19th March 2020.",
    ar: "هذه القسيمة صالحة فقط لتاريخ 18 و19 مارس 2020."
  },
  DUPLICATE_COUPON: {
    en: "Coupon with the given code already exists.",
    ar: "القسيمة مع الرمز المحدد موجودة بالفعل."
  },
  COUPON_DELETE_SUCCESS: {
    en: "Coupon removed successfully",
    ar: "تم إزالة القسيمة بنجاح"
  },
  COUPON_VALID: {
    en: "Coupon is valid",
    ar: "القسيمة صالحة"
  },
  COUPON_INVALID: {
    en: "Coupon is invalid",
    ar: "القسيمة غير صالحة"
  },
  MAX_USER_LIMIT_REACHED: {
    en: "You have already used this coupon code.",
    ar: "لقد استخدمت رمز القسيمة هذا بالفعل."
  },
  MAX_REDEMPTION_REACHED: {
    en: "This coupon has reached its maximum redemption.",
    ar: "لقد وصلت هذه القسيمة إلى الحد الأقصى للاسترداد."
  },
  NO_COUPON_AVAILABLE: {
    en: "No coupon is available",
    ar: "لا توجد قسيمة متاحة"
  },
  EXPIRED: {
    en: "The coupon's validity is expired",
    ar: "انتهت صلاحية القسيمة"
  },
  NOT_STARTED: {
    en: "The coupon is not valid yet",
    ar: "القسيمة ليست صالحة بعد"
  }
};

const WEBVIEW_CONSTANTS = {
  UPDATED: {
    en: "Document updated successfully",
    ar: "تم تحديث المستند بنجاح"
  },
  CREATED: {
    en: "Document created successfully",
    ar: "تم إنشاء المستند بنجاح"
  },
  DELETED_SUCCESSFULLY: {
    en: "Deleted successfully",
    ar: "تم الحذف بنجاح"
  },
  INVALID_ID: {
    en: "Invalid Object ID",
    ar: "معرف الكائن غير صالح"
  },
  NOT_FOUND: {
    en: "Not found",
    ar: "غير موجود"
  }
};


const CONTENT_CONSTANTS = {
  CREATE_SUCCESS: {
    en: "Content created successfully",
    ar: "تم إنشاء اللافتة بنجاح"
  },
  UPDATE_SUCCESS: {
    en: "Content updated successfully",
    ar: "تم تحديث اللافتة بنجاح"
  },
  DELETE_SUCCESS: {
    en: "Content deleted successfully",
    ar: "تم حذف اللافتة بنجاح"
  },
  LIST_SUCCESS: {
    en: "Content listed successfully",
    ar: "تم سرد اللافتات بنجاح"
  },
  INVALID_JOURNAL_ID: {
    en: "Invalid Content ID",
    ar: "معرف اللافتة غير صالح"
  },
  NOT_FOUND: {
    en: "Content not found",
    ar: "اللافتة غير موجودة"
  }
};

module.exports = {
  MIDDLEWARE_AUTH_CONSTANTS,
  AUTH_CONSTANTS,
  OTP_CONSTANTS,
  USER_CONSTANTS,
  ADMIN_CONSTANTS,
  MANAGER_CONSTANTS,
  SYSTEM_CONSTANTS,
  SUPPORT_TICKET_CONSTANTS,
  CATEGORY_CONSTANTS,
  FILE_UPLOAD_CONSTANTS,
  BANNER_CONSTANTS,
  JOURNAL_CONSTANTS,
  CONFERENCE_CONSTANTS,
  VALIDATION_CONSTANTS,
  COUPON_CONSTANTS,
  WEBVIEW_CONSTANTS,
  TOPIC_CONSTANTS,
  CONTENT_CONSTANTS
};
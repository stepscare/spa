import mongoose from 'mongoose';
import Category from '../models/Category';
import Item from '../models/Item';
import dbConnect from '../utility/dbConnect';

const categoriesAndItems = [
  {
    title: 'العناية بالأظافر',
    items: [
      { title: 'برد الاظافر', price: '20' },
      { title: 'سبا لليدين', price: '80' },
      { title: 'تركيب أظافر بدون لون', price: '95' },
      { title: 'عناية اليدين وتركيب أظافر', price: '150' },
      { title: 'طلاء لون عادى لليدين', price: '25' },
      { title: 'طلاء لون فرنسى لليدين', price: '50' },
      { title: 'طلاء لون جل (فرنسى -كروم -اومبرى)', price: '90' },
      { title: 'رسم لظفر واحد', price: '20' },
      { title: 'ستيكر لظفر واحد', price: '5' },
      { title: 'جل اكستنش دائم', price: '350' },
      { title: 'جل اكستنش مؤقت', price: '258' },
      { title: 'اطالة الاظافر بالأكريليك بدون لون', price: '350' },
      { title: 'إطالة الاظافر بالاكريليك مع لون', price: '390' },
      { title: 'سبا العناية لليدين والقدمين', price: '205' },
      { title: 'كلاسيك العناية لليدين والقدمين', price: '160' },
      { title: 'عناية القدمين', price: '95' },
      { title: 'سبا فاخر للقدمين', price: '145' },
      { title: 'طلاء لون جل للقدمين', price: '70' },
      { title: 'طلاء لون عادى للقدمين', price: '25' },
      { title: 'إزالة الطلاء العادى', price: '6' },
      { title: 'إزالة شيلاك بدون عناية', price: '40' },
      { title: 'إزالة شيلاك مع عناية', price: '100' },
      { title: 'إزالة الجل', price: '100' },
      { title: 'إعادة تعبئة الجل', price: '105' },
      { title: 'إعادة تعبئة الظفر', price: '30' },
    ],
  },
  {
    title: 'العناية بالشعر',
    items: [
      { title: 'استشوار شعر قصير', price: '85-100' },
      { title: 'استشوار شعر متوسط', price: '100-150' },
      { title: 'استشوار شعر طويل', price: '150-200' },
      { title: 'استشوار مع ويفى شعر قصير', price: '150' },
      { title: 'استشوار مع ويفى شعر متوسط', price: '200' },
      { title: 'استشوار مع ويفى شعر طويل', price: '250' },
    ],
  },
  {
    title: 'قص الشعر',
    items: [
      { title: 'قص الغرة', price: '30' },
      { title: 'قص الأطراف', price: '50' },
      { title: 'قص بوى مكينة', price: '80-200' },
      { title: 'قص مدرج', price: '85-200' },
      { title: 'ريترو الشعر القصير', price: '250' },
      { title: 'ريترو الشعر المتوسط', price: '250-350' },
      { title: 'ريترو شعر الطويل', price: '400-550' },
    ],
  },
  {
    title: 'التساريح',
    items: [
      { title: 'شعر قصير', price: '200' },
      { title: 'شعر قصير متوسط', price: '250' },
      { title: 'شعر متوسط الطول', price: '300' },
      { title: 'شعر طويل', price: '350' },
      { title: 'طويل جدا', price: '400' },
      { title: 'ضفاير فرنسية', price: '40-100' },
      { title: 'الجدايل الافريقية', price: '300-800' },
    ],
  },
  {
    title: 'معالجات الشعر',
    items: [
      { title: 'فرد الكيراتين المعالج', price: '2500-2900' },
      { title: 'فرد البروتين المعالج', price: '8500-2200' },
      { title: 'معالج الكفيار', price: '200-500' },
      { title: 'ماسك مرطب عادى', price: '130-250' },
      { title: 'ماسك ترطيب عميق (البارد)', price: '230-650' },
      { title: 'صبغات لون', price: '220-900' },
      { title: 'جذور اورينساج', price: '150-350' },
      { title: 'هايلايت -اومبرى – لولايت', price: '450-1800' },
      { title: 'سحب لون كامل سومبرى', price: '550-1650' },
      { title: 'كنتور على حسب طول الخصلة', price: '120-250' },
      { title: 'ديتوكس تنظيف فروة الراس', price: '155' },
      { title: 'ديتوكس تنظيف فروة الراس (مجموعة كيراستاس)', price: '185' },
    ],
  },
  {
    title: 'المساج',
    items: [
      { title: 'مساج الاسترخاء', price: '185' },
      { title: 'مساج الأحجار الساخنة', price: '240' },
      { title: 'مساج الأعشاب الدافئة تايلندى', price: '240' },
      { title: 'مساج سويدى', price: '200' },
      { title: 'مساج الزيت الشمعى', price: '230' },
      { title: 'تدليك حوامل', price: '150' },
      { title: 'مساج الاخشاب', price: '200' },
      { title: 'بكج مساج الاخساب 3 جلسات', price: '500' },
      { title: 'تدليك الاقدام', price: '80' },
    ],
  },
  {
    title: 'الحمام المغربى',
    items: [
      { title: 'الحمام المغربى الكلاسيك', price: '230' },
      { title: 'حمام خطوات العناية (vip)', price: '420' },
      { title: 'حمام مغربى بزيت الأركان', price: '320' },
      { title: 'الحمام المغربى بزيت الاكليل', price: '260' },
    ],
  },
  {
    title: 'الحواجب',
    items: [
      { title: 'تقشير او صبغة حواجب', price: '45' },
      { title: 'تقشير مع صبغة حواجب', price: '65' },
      { title: 'تقشير وجه كامل', price: '50' },
      { title: 'ترقيع حواجب', price: '200' },
    ],
  },
  {
    title: 'الرموش',
    items: [
      { title: 'تركيب رموش يومية', price: '75' },
      { title: 'تركيب رموش أسبوعية', price: '160' },
      { title: 'رموش دائمة كلاسيك متوسطة الكثافة', price: '360' },
      { title: 'رموش دائمة (فوليوم )كثيفة', price: '420' },
      { title: 'رفع رموش', price: '385' },
    ],
  },
  {
    title: 'واكس الشمع',
    items: [
      { title: 'واكس جسم كامل', price: '280' },
      { title: 'واكس وجه', price: '90' },
      { title: 'واكس وجه ورقبة', price: '52' },
      { title: 'واكس شنب', price: '20' },
      { title: 'واكس او فتلة حواجب', price: '35' },
      { title: 'واكس القدم كال', price: '160' },
      { title: 'واكس القدم للركبة', price: '80' },
      { title: 'واكس يد كاملة', price: '150' },
      { title: 'واكس يد للمرفقين', price: '70' },
      { title: 'واكس الابطين', price: '60' },
    ],
  },
  {
    title: 'العناية بالجسم',
    items: [
      { title: 'تقشير الجسم بالذهب', price: '115' },
      { title: 'تقشير الجسم بالشيكولاتة', price: '115' },
      { title: 'تقشير الجسم بالفحم', price: '115' },
      { title: 'تقشير الجسم بالقهوة', price: '115' },
    ],
  },
];

dbConnect().then(async () => {
  try {
    await Category.deleteMany({});
    await Item.deleteMany({});

    for (const categoryData of categoriesAndItems) {
      const category = new Category({ title: categoryData.title });
      await category.save();

      const items = categoryData.items.map(itemData => ({
        ...itemData,
        categoryId: category._id,
      }));

      await Item.insertMany(items);
    }

    console.log('Categories and items seeded successfully');
  } catch (error) {
    console.error('Error seeding data', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(error => {
  console.error('Error connecting to database', error);
});

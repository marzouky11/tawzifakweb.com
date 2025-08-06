
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2, UserPlus, Mail, Lock, User, MapPin, Globe } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Checkbox } from '@/components/ui/checkbox';

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "كلمة المرور ضعيفة",
            description: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
        });
        return;
    }
    if (!gender) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'الرجاء تحديد الجنس.' });
      return;
    }
    if (!country) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'الرجاء تحديد الدولة.' });
      return;
    }
    if (!city) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'الرجاء تحديد المدينة.' });
      return;
    }
    if (!agreedToTerms) {
        toast({
            variant: 'destructive',
            title: 'مطلوب الموافقة على الشروط',
            description: 'يجب عليك الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.',
        });
        return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });


      const colors = [
        '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
        '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        gender,
        country,
        city,
        avatarColor: randomColor,
        createdAt: serverTimestamp(),
      });

      toast({ title: 'تم إنشاء الحساب بنجاح!' });
      const redirectUrl = searchParams.get('redirect');
      router.push(redirectUrl || '/');
    } catch (error: any) {
      let errorMessage = "حدث خطأ غير متوقع.";
       if (error.code === 'auth/email-already-in-use') {
           errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل.";
       }
      toast({
        variant: 'destructive',
        title: 'خطأ في إنشاء الحساب',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MobilePageHeader title="إنشاء حساب جديد">
        <UserPlus className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="container mx-auto max-w-md pb-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center md:hidden">
             <div className="mx-auto bg-primary/10 w-fit p-3 rounded-full mb-2">
                <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">👋 أهلاً بك في توظيفك!</CardTitle>
            <CardDescription>
              سجّل مجانًا لاكتشاف فرص العمل أو لعرض خدماتك والتواصل مع أصحاب المشاريع.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-6">
            <form onSubmit={handleSignup} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  الاسم الكامل
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground pt-1">
                    📩 استخدم بريدًا حقيقيًا لتلقي إشعارات الوظائف.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground pt-1">
                    🔐 اختر كلمة مرور قوية (6 أحرف على الأقل) لحماية حسابك.
                </p>
              </div>

              <div className="space-y-3">
                <Label>الجنس</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value: 'male' | 'female') => setGender(value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal cursor-pointer">ذكر</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal cursor-pointer">أنثى</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  الدولة
                </Label>
                <Input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  placeholder="الدولة التي تقيم بها"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  المدينة
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="المدينة التي تقيم بها"
                />
              </div>
              
              <div className="flex items-start space-x-2 space-x-reverse pt-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    أوافق على <Link href="/terms" target="_blank" className="text-primary hover:underline">شروط الاستخدام</Link> و <Link href="/privacy" target="_blank" className="text-primary hover:underline">سياسة الخصوصية</Link>.
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              لديك حساب بالفعل؟{' '}
              <Link href={`/login?${searchParams.toString()}`} className="text-primary hover:underline font-semibold">
                سجل الدخول
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

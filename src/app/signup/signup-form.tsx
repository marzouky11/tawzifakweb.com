
'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
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
import ReCAPTCHA from 'react-google-recaptcha';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.657-11.303-8H6.399v4.865C9.512,40.18,16.22,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.28,44,30.03,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);


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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const colors = [
          '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
          '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          avatarColor: randomColor,
          createdAt: serverTimestamp(),
        });
      }
      
      toast({
        title: `👋 مرحبًا ${user.displayName || 'بعودتك'}!`,
        description: 'تم تسجيل دخولك بنجاح!',
      });
      const redirectUrl = searchParams.get('redirect');
      router.push(redirectUrl || '/');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل عبر Google",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

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
    if (!recaptchaToken) {
        toast({
            variant: 'destructive',
            title: 'مطلوب التحقق',
            description: 'الرجاء إثبات أنك لست روبوتًا.',
        });
        return;
    }

    setLoading(true);
    try {
      // NOTE: Server-side verification of the recaptchaToken is required for security.
      // This front-end implementation is for UI purposes only.

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
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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
            <Button variant="outline" className="w-full mb-4" onClick={handleGoogleSignIn} disabled={googleLoading}>
              {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
              التسجيل باستخدام Google
            </Button>
            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">
                أو
              </span>
            </div>
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
              
              <div className="flex justify-center">
                 <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LcuupwrAAAAAP7d9JIkTUu8H2qeGMmyRE1T81Ga"
                    onChange={setRecaptchaToken}
                    onExpired={() => setRecaptchaToken(null)}
                    hl="ar"
                  />
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

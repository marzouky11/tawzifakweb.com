
'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2, LogIn, Mail, Lock } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
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


export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore, if not, create them
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
        description: 'سعيدون بعودتك إلى توظيفك! تصفح فرص العمل أو أنشر إعلانك الآن.',
      });
      const redirectUrl = searchParams.get('redirect');
      router.push(redirectUrl || '/');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول عبر Google",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: `👋 مرحبًا ${userCredential.user.displayName || 'بعودتك'}!`,
        description: 'سعيدون بعودتك إلى توظيفك! تصفح فرص العمل أو أنشر إعلانك الآن.',
      });
      const redirectUrl = searchParams.get('redirect');
      router.push(redirectUrl || '/');
    } catch (error: any) {
       let errorMessage = "الرجاء التحقق من البريد الإلكتروني أو كلمة المرور.";
       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
           errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
       }
      toast({
        variant: 'destructive',
        title: 'خطأ في تسجيل الدخول',
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
      <MobilePageHeader title="تسجيل الدخول">
        <LogIn className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="container mx-auto max-w-md pb-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center md:hidden">
            <div className="mx-auto bg-primary/10 w-fit p-3 rounded-full mb-2">
                <LogIn className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">أهلاً بك مجدداً!</CardTitle>
            <CardDescription>سجّل دخولك للوصول إلى حسابك وإدارة إعلاناتك.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-6">
             <Button variant="outline" className="w-full mb-4" onClick={handleGoogleSignIn} disabled={googleLoading}>
              {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
              تسجيل الدخول باستخدام Google
            </Button>
            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">
                أو
              </span>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password"  className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                 <p className="text-xs text-muted-foreground pt-1">
                    🔐 كلمة المرور الخاصة بك مشفرة ومحمية بالكامل.
                </p>
              </div>

              <div className="flex justify-center pt-2">
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
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              ليس لديك حساب؟{' '}
              <Link href={`/signup?${searchParams.toString()}`} className="text-primary hover:underline font-semibold">
                أنشئ حسابًا جديدًا
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

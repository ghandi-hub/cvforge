<script lang="ts">
  import { Terminal, ArrowRight } from 'lucide-svelte';
</script>

<div class="min-h-screen flex items-center justify-center p-6 bg-slate-100">
  <div class="brutal-card p-8 max-w-md w-full bg-white space-y-6">
    <div class="flex items-center gap-3 border-b-2 border-black pb-4">
      <div class="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-lg border-2 border-black shadow-[2px_2px_0px_#000]">
        CV
      </div>
      <div>
        <h1 class="font-black text-xl tracking-tight">MASUK KE CVFORGE</h1>
        <p class="text-xs text-slate-500 font-medium">Autentikasi akun untuk mengelola CV</p>
      </div>
    </div>

    <div class="space-y-4">
      <p class="text-sm font-medium text-slate-700">
        Masuk untuk menyimpan banyak CV secara aman, mencocokkan kata kunci lowongan secara instan, dan mengekspor PDF ramah ATS.
      </p>

      <a href="/auth/google" class="brutal-btn brutal-btn-primary w-full py-3.5 text-center flex items-center justify-center gap-2">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
        MASUK DENGAN GOOGLE
      </a>
    </div>

    <div class="border-t-2 border-black pt-4 text-center">
      <a href="/" class="text-xs font-bold text-slate-600 hover:underline">← KEMBALI KE BERANDA</a>
    </div>
  </div>
</div>

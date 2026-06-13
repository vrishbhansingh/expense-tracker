<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password as PasswordRule;

class UserController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'currency' => ['nullable', 'string', 'size:3'],
            'timezone' => ['nullable', 'string', 'max:50'],
            'notifications_enabled' => ['boolean'],
        ]);

        $request->user()->update($data);

        return response()->json($request->user());
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $request->user()->update(['password' => Hash::make($data['password'])]);

        return response()->json(['message' => 'Password updated']);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate(['avatar' => ['required', 'image', 'max:2048']]);

        if ($request->user()->avatar) {
            Storage::disk('public')->delete($request->user()->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $request->user()->update(['avatar' => $path]);

        return response()->json([
            'avatar' => $path,
            'avatar_url' => Storage::url($path),
        ]);
    }
}

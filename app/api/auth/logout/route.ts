import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ status: 'success', message: 'Logged out successfully' });
  response.cookies.delete('fitai_session');
  return response;
}

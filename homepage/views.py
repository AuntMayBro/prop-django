# homepage/views.py

from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.template.loader import render_to_string # Import render_to_string

def homepage(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_body = request.POST.get('message')

        if not all([name, email, message_body]):
            return JsonResponse({'status': 'error', 'message': 'Please fill out all fields.'}, status=400)

        # --- Create the context for the email templates ---
        context = {
            'name': name,
            'email': email,
            'message_body': message_body,
        }

        # --- Create Plain Text Email ---
        # This is for email clients that don't support HTML
        text_content = f"""
        New Portfolio Message
        -----------------------
        From: {name} ({email})
        Message:
        {message_body}
        """

        # --- Create Rich HTML Email ---
        # This uses a simple, robust HTML structure with inline CSS for compatibility
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4A5699; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Portfolio Contact</h2>
                    <p style="margin-bottom: 20px;">You have received a new message from your website's contact form.</p>
                    
                    <strong style="color: #4A5699;">Name:</strong>
                    <p style="background-color: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 5px;">{name}</p>
                    
                    <strong style="color: #4A5699;">Email:</strong>
                    <p style="background-color: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 5px;">{email}</p>
                    
                    <strong style="color: #4A5699;">Message:</strong>
                    <div style="background-color: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap;">{message_body}</div>
                </div>
            </body>
        </html>
        """

        try:
            send_mail(
                subject=f'New Contact Form Submission from {name}',
                message=text_content,  # Plain text message
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=['bagriaditya00@gmail.com'],
                html_message=html_content, # HTML message
                fail_silently=False,
            )
            return JsonResponse({'status': 'success', 'message': 'Message sent successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'An error occurred: {e}'}, status=500)

    return render(request, 'homepage/index.html')
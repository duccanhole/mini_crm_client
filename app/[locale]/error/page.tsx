'use client';

import React, { Suspense } from 'react';
import { Result, Button } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

const ErrorContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tCommon = useTranslations('common');
    const tMsg = useTranslations('msg');

    const code = searchParams.get('code') || '500';
    const messageParam = searchParams.get('message');

    // Determine the message: try to translate from 'msg', then 'common', then use literal or fallback
    let message = '';
    if (messageParam) {
        // Simple check: if translation exists in msg, use it
        try {
            message = tMsg(messageParam);
        } catch {
            try {
                message = tCommon(messageParam);
            } catch {
                message = messageParam;
            }
        }
    } else {
        message = tCommon('failed');
    }

    const statusMap: Record<string, any> = {
        '403': '403',
        '404': '404',
        '500': '500',
        'success': 'success',
        'error': 'error',
        'info': 'info',
        'warning': 'warning',
    };

    const status = statusMap[code] || 'error';

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Result
                status={status}
                title={code}
                subTitle={message}
                extra={
                    <Button type="primary" onClick={() => router.push('/')}>
                        {tCommon('backHome')}
                    </Button>
                }
            />
        </div>
    );
};

const ErrorPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent />
        </Suspense>
    );
};

export default ErrorPage;

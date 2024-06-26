import type { CouponQueryOptions, SettingsQueryOptions } from '@type/index';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import client from '@framework/utils/index';
import { API_ENDPOINTS } from '@framework/utils/endpoints';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) =>
      client.settings.findAll(queryKey[1] as SettingsQueryOptions),
  );

  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.COUPONS, { language: locale }],
    ({ queryKey }) => client.coupons.all(queryKey[1] as CouponQueryOptions),
  );
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'menu',
        'forms',
        'footer',
      ])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

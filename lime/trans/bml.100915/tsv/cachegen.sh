#!/usr/bin/sh

# *****  ①マスターTSV生成処理  *****
# 0) 各オリジナルファイルtsv生成
./filter_voddetail.sh getContentDetail.tsv.orig | grep 'video_program\|video_package\|wizard\|video_series' > getVODContentDetail.tsv.orig
./filter_tvdetail.sh getContentDetail.tsv.orig | grep 'tv_programs_promotion\|tv_channel\|tv_program' > getTVContentDetail.tsv.orig
./filter_premiumdetail.sh getContentDetail.tsv.orig | grep 'channel_package\|tv_channel\|channel_svod\|subscription_package\|series_svod\|karaoke_package' > getCHSVODContentDetail.tsv.orig

# 1) 各詳細系tsv生成
./filter_voddetail.sh getVODContentDetail.tsv.orig > getVODContentDetail.tsv
./filter_tvdetail.sh getTVContentDetail.tsv.orig > getTVContentDetail.tsv
./filter_premiumdetail.sh getCHSVODContentDetail.tsv.orig > getCHSVODContentDetail.tsv

# 2) ホームパレードtsv生成
./filter_homeparade.sh getContentDetail.tsv.orig grep 'video_program\|video_package\|wizard\|channel_package\|tv_programs_promotion\|tv_channel' > homeParade.tsv

# 3) VOD系tsv生成
./filter_vodlist.sh getVODContentDetail.tsv.orig | grep -v 'wizard' > searchComingEnd.tsv
./filter_vodlist.sh getVODContentDetail.tsv.orig | grep -v 'wizard' > searchGenre.tsv
./filter_vodlist.sh getVODContentDetail.tsv.orig | grep 'video_program' > searchId.tsv
./filter_vodlist.sh getVODContentDetail.tsv.orig | grep -v 'wizard' > searchNewArrival.tsv
./filter_vodlist.sh getVODContentDetail.tsv.orig | grep -v 'wizard' > searchRanking.tsv
./filter_vodlist.sh getVODContentDetail.tsv.orig | grep -v 'wizard' > searchVODRelatedContents.tsv
./filter_vodlist.sh getVODContentDetail.tsv.orig | grep 'video_program' > searchVODMemberOf.tsv
./filter_wizardlist.sh getVODContentDetail.tsv.orig > searchWizardMemberOf.tsv
./filter_vodparade.sh getContentDetail.tsv.orig  | grep 'video_program'> vodParade.tsv

# 4) チャンネル系tsv生成
./filter_channellist.sh getTVContentDetail.tsv.orig |grep 'tv_channel' > searchTVGenre.tsv
./filter_tvparade.sh getTVContentDetail.tsv.orig |grep 'tv_channel'> tvParade.tsv
./filter_tvparade.sh getCHSVODContentDetail.tsv.orig |grep 'channel_package'>> tvParade.tsv
./filter_tvseries.sh getTVContentDetail.tsv.orig |grep tv_program[[:space:]] > searchTVSeriesMemberOf.tsv

# 5) プレミアム系tsv生成
./filter_premiumlist.sh getCHSVODContentDetail.tsv.orig |grep 'tv_channel\|channel_package\|channel_svod' > searchPremium_1.tsv
./filter_premiumlist.sh getCHSVODContentDetail.tsv.orig |grep 'subscription_package\|series_svod'> searchPremium_2.tsv
./filter_premiumlist.sh getCHSVODContentDetail.tsv.orig |grep 'karaoke_package\|karaoke_program' > searchPremium_3.tsv
./filter_premiumlist.sh getCHSVODContentDetail.tsv.orig |grep 'subscription_package'> searchPremium_4.tsv
./filter_chsvodmember_vod.sh getVODContentDetail.tsv.orig > searchCHSVODMemberOf.tsv
./filter_chsvodmember_tv.sh getTVContentDetail.tsv.orig >> searchCHSVODMemberOf.tsv

# 6) アクティブリスト系tsv生成
./filter_activechannelslist.sh  getTVContentDetail.tsv.orig |grep 'tv_channel\|channel_package\|channel_svod' > activeChannels.tsv
./filter_activelistvod.sh getContentDetail.tsv.orig | grep 'video_program\|subscription_package\|video_package\|series_svod'> activeListVod.tsv
./filter_activepremiumlist.sh getCHSVODContentDetail.tsv.orig > activePremiums.tsv

# 7) お知らせ系tsv生成
cat getNewAnnouncements.tsv >> homeParade.tsv
cat getNewAnnouncements.tsv >> vodParade.tsv
cat getNewAnnouncements.tsv >> tvParade.tsv
cat searchPremium_1.tsv >> tvParade.tsv

# STEP2.0 カラオケ検索用
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeNewArrival.tsv
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_series' > searchKaraokePickUpGIT.tsv
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeRanking.tsv
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeGeneration.tsv
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeGenre.tsv
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeByArtist.tsv
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeByTitle.tsv
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeId.tsv
./filter_karaokeartistlist.sh getKaraokeArtistContentDetail.tsv.orig > searchKaraokeArtistList.tsv
./filter_karaokereservationlist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeReservationList.tsv
./filter_karaokehist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > getKaraokeHistory.tsv

# STEP2.0 カラオケパレード
./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_series' > karaokeParade.tsv

# STEP2.0 カラオケ詳細
./filter_karaokedetail.sh getContentDetail.tsv.orig |grep 'karaoke_program\|karaoke_series' > getKaraokeContentDetail.tsv

# STEP2.0 カラオケグループ
./filter_karaokemember.sh getContentDetail.tsv.orig |grep 'karaoke_program' > searchKaraokeMemberOf.tsv

# STEP2.0 カラオケ予約一覧
#./filter_karaokelist.sh getContentDetail.tsv.orig |grep 'karaoke_program' > getKaraokeReservationList.tsv

# 8) NOD系TSV一覧
#  8-1) パレード
./filter_vodparade.sh getContentDetail.tsv.orig | grep 'video_program\|video_package' > nodParade.tsv

#  8-2) ウィザードGIT
./filter_wizardgit.sh getVODContentDetail.tsv.orig | grep 'wizard' > getNodWizardGIT.tsv

#  STEP2.5 プラン
./filter_enablechangeplanlist.sh getContentDetail.tsv.orig | grep 'plan_detail' > getEnableChangePlanList.tsv
./filter_plandetail.sh getContentDetail.tsv.orig | grep 'plan_detail' > getPlanContentDetail.tsv

# STEP2.5 お知らせ一覧
#./filter_getnotice.sh getVODContentDetail.tsv.orig | grep '' > getNotice.tsv


# *****  ②全TSV件数表示  *****
echo var VOD_CONTENT_TOTAL = `wc -l searchGenre.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var VOD_IDLIST_TOTAL = `wc -l searchId.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var VOD_RELATED_CONTENT_TOTAL = `wc -l searchVODRelatedContents.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var ANNOUNCEMENT_TOTAL = `wc -l getAnnouncementContentDetail.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var TV_CONTENT_TOTAL = `wc -l getTVContentDetail.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var CHSVOD_CONTENT_TOTAL = `wc -l getCHSVODContentDetail.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var CHANNEL_TOTAL = `wc -l searchTVGenre.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var PREMIUM_1_TOTAL = `wc -l searchPremium_1.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var PREMIUM_2_TOTAL = `wc -l searchPremium_2.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var PREMIUM_3_TOTAL = `wc -l searchPremium_3.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var PREMIUM_4_TOTAL = `wc -l searchPremium_4.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var HOME_PARADE_TOTAL = `wc -l homeParade.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var VOD_PARADE_TOTAL = `wc -l vodParade.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var TV_PARADE_TOTAL = `wc -l tvParade.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var MEMBER_OF_WIZARD_TOTAL = `wc -l searchWizardMemberOf.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var MEMBER_OF_VOD_TOTAL = `wc -l searchVODMemberOf.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var TV_SERIES_TOTAL = `wc -l searchTVSeriesMemberOf.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var MAINTENANCES_TOTAL = `wc -l getMaintenances.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var SUPPORTS_TOTAL = `wc -l getSupports.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var NEW_ANNO_TOTAL = `wc -l getNewAnnouncements.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var MEMBER_OF_CHSVOD_TOTAL = `wc -l searchCHSVODMemberOf.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var ACTIVE_CHANNELS_TOTAL = `wc -l activeChannels.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var BUY_LIST_0_TOTAL = `wc -l buyList_0.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var BUY_LIST_1_TOTAL = `wc -l buyList_1.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var BUY_LIST_2_TOTAL = `wc -l buyList_2.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var ACTIVE_LIST_VOD_TOTAL = `wc -l activeListVod.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var ACTIVE_LIST_PREMIUM_TOTAL = `wc -l activePremiums.tsv | sed s'/\(.*\) .*/\1/g'`\;

# STEP2カラオケ用
echo var KARAOKE_CONTENT_TOTAL = `wc -l searchKaraokeNewArrival.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var KARAOKE_GIT_CONTENT_TOTAL = `wc -l searchKaraokePickUpGIT.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var KARAOKE_BY_ARTIST_TOTAL = `wc -l searchKaraokeByArtist.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var KARAOKE_BY_TITLE_TOTAL = `wc -l searchKaraokeByTitle.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var MEMBER_OF_KARAOKE_TOTAL = `wc -l searchKaraokeMemberOf.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var KARAOKE_ARTIST_TOTAL = `wc -l searchKaraokeArtistList.tsv | sed s'/\(.*\) .*/\1/g'`\;
#echo var KARAOKE_RESERVATION_LIST_TOTAL = `wc -l getKaraokeReservationList.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var KARAOKE_PARADE_TOTAL = `wc -l karaokeParade.tsv | sed s'/\(.*\) .*/\1/g'`\;

# NOD用
echo var NOD_PARADE_TOTAL = `wc -l nodParade.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var NOD_WIZARD_CONTENT_TOTAL = `wc -l getNodWizardGIT.tsv | sed s'/\(.*\) .*/\1/g'`\;
#echo var NOD_MAINTENANCES_TOTAL = `wc -l getMaintenances.tsv | sed s'/\(.*\) .*/\1/g'`\;
#echo var NOD_SUPPORTS_TOTAL = `wc -l getSupports.tsv | sed s'/\(.*\) .*/\1/g'`\;
#echo var NOD_NEW_ANNO_TOTAL = `wc -l getNewAnnouncements.tsv | sed s'/\(.*\) .*/\1/g'`\;
echo var ANNO_SUPPORTS_TOTAL = `wc -l searchAnnouncementSupports.tsv | sed s'/\(.*\) .*/\1/g'`\;

# *****  ③TSV分割処理  *****
# split -a 2 -l 1 -d getContentDetail.tsv getContentDetail.tsv.
split -a 2 -l 1 -d getVODContentDetail.tsv getVODContentDetail.tsv.
split -a 2 -l 1 -d getAnnouncementContentDetail.tsv getAnnouncementContentDetail.tsv.
split -a 2 -l 1 -d getCHSVODContentDetail.tsv getCHSVODContentDetail.tsv.
split -a 2 -l 1 -d getTVContentDetail.tsv getTVContentDetail.tsv.
split -a 2 -l 9 -d getMaintenances.tsv getMaintenances.tsv.
split -a 2 -l 9 -d getNewAnnouncements.tsv getNewAnnouncements.tsv.
split -a 2 -l 9 -d getSupports.tsv getSupports.tsv.
split -a 2 -l 5 -d homeParade.tsv homeParade.tsv.
split -a 2 -l 9 -d searchComingEnd.tsv searchComingEnd.tsv.
split -a 2 -l 9 -d searchGenre.tsv searchGenre.tsv.
split -a 2 -l 9 -d searchId.tsv searchId.tsv.
split -a 2 -l 9 -d searchNewArrival.tsv searchNewArrival.tsv.
split -a 2 -l 9 -d searchPremium_1.tsv searchPremium_1.tsv.
split -a 2 -l 9 -d searchPremium_2.tsv searchPremium_2.tsv.
split -a 2 -l 9 -d searchPremium_3.tsv searchPremium_3.tsv.
split -a 2 -l 9 -d searchPremium_4.tsv searchPremium_4.tsv.
split -a 2 -l 9 -d searchRanking.tsv searchRanking.tsv.
split -a 2 -l 5 -d searchTVGenre.tsv searchTVGenre.tsv.
split -a 2 -l 9 -d searchVODMemberOf.tsv searchVODMemberOf.tsv.
split -a 2 -l 9 -d searchVODRelatedContents.tsv searchVODRelatedContents.tsv.
split -a 2 -l 9 -d searchWizardMemberOf.tsv searchWizardMemberOf.tsv.
split -a 2 -l 9 -d searchCHSVODMemberOf.tsv searchCHSVODMemberOf.tsv.
split -a 2 -l 5 -d tvParade.tsv tvParade.tsv.
split -a 2 -l 5 -d vodParade.tsv vodParade.tsv.
split -a 2 -l 9 -d activeChannels.tsv activeChannels.tsv.
split -a 2 -l 9 -d buyList_0.tsv buyList_0.tsv.
split -a 2 -l 9 -d buyList_1.tsv buyList_1.tsv.
split -a 2 -l 9 -d buyList_2.tsv buyList_2.tsv.
split -a 2 -l 9 -d activePremiums.tsv activePremiums.tsv.
split -a 2 -l 9 -d activeListVod.tsv activeListVod.tsv.

# STEP2カラオケ用
split -a 2 -l 9 -d searchKaraokeNewArrival.tsv searchKaraokeNewArrival.tsv.
split -a 2 -l 9 -d searchKaraokePickUpGIT.tsv searchKaraokePickUpGIT.tsv.
split -a 2 -l 9 -d searchKaraokeRanking.tsv searchKaraokeRanking.tsv.
split -a 2 -l 9 -d searchKaraokeGeneration.tsv searchKaraokeGeneration.tsv.
split -a 2 -l 9 -d searchKaraokeGenre.tsv searchKaraokeGenre.tsv.
split -a 2 -l 9 -d searchKaraokeArtistList.tsv searchKaraokeArtistList.tsv.
split -a 2 -l 9 -d searchKaraokeByArtist.tsv searchKaraokeByArtist.tsv.
split -a 2 -l 9 -d searchKaraokeByTitle.tsv searchKaraokeByTitle.tsv.
split -a 2 -l 9 -d searchKaraokeId.tsv searchKaraokeId.tsv.
split -a 2 -l 1 -d getKaraokeContentDetail.tsv getKaraokeContentDetail.tsv.
split -a 2 -l 9 -d searchKaraokeMemberOf.tsv searchKaraokeMemberOf.tsv.
#split -a 2 -l 9 -d getKaraokeReservationList.tsv getKaraokeReservationList.tsv.
split -a 2 -l 5 -d karaokeParade.tsv karaokeParade.tsv.
split -a 2 -l 9 -d searchKaraokeReservationList.tsv searchKaraokeReservationList.tsv.
split -a 2 -l 9 -d getKaraokeHistory.tsv getKaraokeHistory.tsv.

# NOD用
split -a 2 -l 5 -d nodParade.tsv nodParade.tsv.
split -a 2 -l 1 -d getNodWizardGIT.tsv getNodWizardGIT.tsv.
#split -a 2 -l 9 -d getMaintenances.tsv getNodMaintenances.tsv.
#split -a 2 -l 9 -d getNewAnnouncements.tsv getNodNewAnnouncements.tsv.
#split -a 2 -l 9 -d getSupports.tsv getNodSupports.tsv.
split -a 2 -l 9 -d searchAnnouncementSupports.tsv searchAnnouncementSupports.tsv.


#STEP2.5 用
split -a 2 -l 1 -d getEnableChangePlanList.tsv getEnableChangePlanList.tsv.
split -a 2 -l 1 -d getPlanContentDetail.tsv getPlanContentDetail.tsv.
#split -a 2 -l 1 -d getNotice.tsv getNotice.tsv.


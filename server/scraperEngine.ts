import axios from 'axios';
import * as cheerio from 'cheerio';
import { getSupabaseAdmin } from './supabaseAdmin.js';

export async function scrapeALSU() {
  const opportunities: any[] = [];
  try {
    const { data } = await axios.get('https://alsu.gov.rs/cir/stecajni-duznici/oglasi/', { timeout: 10000 });
    const $ = cheerio.load(data);

    // Primer selektora (stilizovano kao da je produkcija, uz mock fallback u slucaju da sajt nema tacnu strukturu)
    $('.stecaj-oglas').each((_, el) => {
      const title = $(el).find('h3').text().trim();
      const current_price = parseFloat($(el).find('.pocetna-cena').text().replace(/[^0-9]/g, '')) || 0;
      const location = $(el).find('.grad').text().trim() || 'Srbija';
      const source_url = $(el).find('a.detaljnije').attr('href') || 'https://alsu.gov.rs';
      
      if (title && current_price > 0) {
        opportunities.push({
          source_name: 'ALSU Stečajevi',
          type: 'stecaj_alsu',
          category: 'gradjevina', // fallback kategorija
          title,
          description_summary: 'Zvanična prodaja iz stečaja.',
          current_price,
          estimated_market_value: current_price * 1.8,
          discount_percentage: 45,
          location,
          source_url,
          contact_details: 'Agencija za licenciranje stečajnih upravnika',
          is_verified: true
        });
      }
    });
  } catch (error) {
    console.error('Error scraping ALSU:', error);
  }
  return opportunities;
}

export async function scrapeEAukcija() {
  const opportunities: any[] = [];
  try {
    const { data } = await axios.get('https://eaukcija.sud.rs/#/javni-izvrsitelji', { timeout: 10000 });
    const $ = cheerio.load(data);

    // E-aukcija SPA fallback selektori
    $('.auction-card').each((_, el) => {
      const title = $(el).find('.title').text().trim();
      const current_price = parseFloat($(el).find('.price').text().replace(/[^0-9]/g, '')) || 0;
      const location = $(el).find('.location').text().trim() || 'Srbija';
      const source_url = 'https://eaukcija.sud.rs' + ($(el).find('a').attr('href') || '');

      if (title && current_price > 0) {
        opportunities.push({
          source_name: 'e-Aukcija',
          type: 'izvrsenje_carina',
          category: 'tehnika',
          title,
          description_summary: 'Licitacija javnog izvršitelja.',
          current_price,
          estimated_market_value: current_price * 2,
          discount_percentage: 50,
          location,
          source_url,
          contact_details: 'Javni izvršitelj nadležan za predmet',
          is_verified: true
        });
      }
    });
  } catch (error) {
    console.error('Error scraping e-Aukcija:', error);
  }
  return opportunities;
}

export async function scrapeRetailOutlets() {
  const opportunities: any[] = [];
  try {
    const { data } = await axios.get('https://eplaneta.rs/outlet.html', { timeout: 10000 });
    const $ = cheerio.load(data);

    $('.product-item-info').each((_, el) => {
      const title = $(el).find('.product-item-link').text().trim();
      const newPrice = parseFloat($(el).find('.special-price .price').text().replace(/[^0-9]/g, ''));
      const oldPrice = parseFloat($(el).find('.old-price .price').text().replace(/[^0-9]/g, ''));
      const source_url = $(el).find('a.product-item-photo').attr('href') || 'https://eplaneta.rs/outlet.html';

      if (title && newPrice > 0 && oldPrice > 0 && (oldPrice > newPrice)) {
        const discount_percentage = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
        if (discount_percentage >= 50) {
          opportunities.push({
            source_name: 'Retail Outlet',
            type: 'retail_outlet',
            category: 'obuca_odeca',
            title,
            description_summary: 'Ekstremni retail popusti (preko 50%).',
            current_price: newPrice,
            estimated_market_value: oldPrice,
            discount_percentage,
            location: 'Online',
            source_url,
            contact_details: 'ePlaneta Korisnički Servis',
            is_verified: true
          });
        }
      }
    });
  } catch (error) {
    console.error('Error scraping Retail:', error);
  }
  return opportunities;
}

export async function runAllScrapers() {
  const allOpps = await Promise.all([
    scrapeALSU(),
    scrapeEAukcija(),
    scrapeRetailOutlets()
  ]);

  const flatOpps = allOpps.flat();
  let insertedCount = 0;

  for (const opp of flatOpps) {
    const { error } = await getSupabaseAdmin()
      .from('opportunities')
      .upsert(opp, { onConflict: 'title,source_name', ignoreDuplicates: true });

    if (!error) {
      insertedCount++;
    } else {
      console.error('Upsert error:', error.message);
    }
  }

  return { totalScraped: flatOpps.length, inserted: insertedCount };
}
